const express = require("express");
const hbs = require("hbs");
const path = require("path");
const nodemailer = require("nodemailer");
// const ejs = require("ejs");
const Razorpay = require("razorpay");
const app = express();
const port = process.env.PORT || 8000;

let myInfo = nodemailer.createTransport({
    service: "gmail",
    port: port,
    auth: {
        user: "hsjaiswal3110@gmail.com",
        pass: "Harsh.2003#"
    }
})


require("./db/conn");

const SignUp = require("./models/signup");
const Product = require("./models/product");

const templatePath = path.join(__dirname, "./templates");
// app.set('view engine', 'ejs');
app.set("views", templatePath);
app.set("view engine", "hbs");
app.use(express.static(templatePath));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


const rajorpay = new Razorpay({
    key_id: "rzp_test_7hVAw10ea11FVb",
    key_secret: "nfKgSU13ajnXEj49oxdj4rEH",
});

app.get("/", (req, res) => {
    res.render("homePage")
})
app.get("/index", (req, res) => {
    res.render("index")
})
app.get("/emailVerification", (req, res) => {
    res.render("emailVerification")
})
app.get("/forgot", (req, res) => {
    res.render("forgot")
})
app.get("/forgotOTPGen", (req, res) => {
    res.render("forgotOTPGen")
})
app.get("/setPassword", (req, res) => {
    res.render("setPassword")
})
app.get("/phone11", (req, res) => {
    res.render("phone11")
})
app.get("/xbox", (req, res) => {
    res.render("xbox")
})
app.get("/verna", (req, res) => {
    res.render("verna")
})
app.get("/sony", (req, res) => {
    res.render("sony")
})
app.get("/samsung", (req, res) => {
    res.render("samsung")
})
app.get("/ps5", (req, res) => {
    res.render("ps5")
})
app.get("/oneplus", (req, res) => {
    res.render("oneplus")
})
app.get("/jordans", (req, res) => {
    res.render("jordans")
})
app.get("/terms", (req, res) => {
    res.render("terms")
})


const d = new Date();
d.getDate();



app.post("/index", (req, res) => {
    try {
        const password = req.body.password;
        const cpassword = req.body.confirmPass;
        if (password === cpassword) {
            const registerStd = SignUp({
                fullName: req.body.name,
                email: req.body.email,
                mobile: req.body.number,
                address: req.body.address,
                password: req.body.password,
                confirmpass: req.body.confirmPass
            })
            let otp = Math.round(1000 + (9999 - 1000) * (Math.random()));
            let mailOptions = {
                from: "hsjaiswal3110@gmail.com",
                to: req.body.email,
                subject: "Message from harsh jaiswal",
                text: `${otp}`
            }
            myInfo.sendMail(mailOptions, function (err, info) {
                if (err) {
                    console.log(err);
                } else {
                    res.status(200).send(info.response);
                }
            })
            res.status(201).render("emailVerification");
            app.post("/emailVerification", (req, res) => {
                console.log(otp);
                if (req.body.actualOtp == req.body.emailVerify) {
                    res.status(201).render("mainp")
                }
                else {
                    console.log(otp)
                    res.send("otp invalid")
                }
                const result = registerStd.save();
            })
        }
        else {
            res.send("Password not matched");
        }
    } catch (err) {
        res.status(400).send(err);
    }

})

app.post("/phone11", async (req, res) => {
    try {
        const bid = Product({
            fullName: req.body.myname,
            productName: "iphone11",
            mobile: req.body.mynumber,
            price: req.body.myprice
        })
        const prodName = await Product.findOne({ productName: "iphone11" })
        if (prodName.price < req.body.myprice) {
            var myquery = { productName: "iphone11" };
            var newvalues = { $set: { productName: "iphone11", fullName: req.body.myname, mobile: req.body.mynumber, price: req.body.myprice } };
            Product.updateOne(myquery, newvalues, function (err, res) {
                if (err) throw err;
            });
            res.render("bid_done");
        }
        else {
            res.status("201").send(`Highest bid is ${prodName.price}. Please enter price higher than this.`)
        }

        app.get("/payment", (req, res) => {
            var options = {
                amount: prodName.price,
                currency: 'INR',
            };
            rajorpay.orders.create(options, function (err, order) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(order);
                    if (d.getDate() > 20) {
                        res.render('rajorpay.ejs', { amount: order.amount, order_id: order.id });
                    }
                    else {
                        res.status(201).send("Bidding in progress")
                    }
                }
            });


        })
    } catch (err) {
        res.status(400).send("err");
    }
})
app.post("/xbox", async (req, res) => {
    try {
        const bid = Product({
            fullName: req.body.myname,
            productName: "xbox",
            mobile: req.body.mynumber,
            price: req.body.myprice
        })
        const prodName = await Product.findOne({ productName: "xbox" })
        if (prodName.price < req.body.myprice) {
            var myquery = { productName: "xbox" };
            var newvalues = { $set: { productName: "xbox", fullName: req.body.myname, mobile: req.body.mynumber, price: req.body.myprice } };
            Product.updateOne(myquery, newvalues, function (err, res) {
                if (err) throw err;
            });
            res.render("bid_done");
        }
        else {
            res.status("201").send(`Highest bid is ${prodName.price}. Please enter price higher than this.`)
        }
        app.get("/payment", (req, res) => {
            var options = {
                amount: prodName.price,
                currency: 'INR',
            };
            rajorpay.orders.create(options, function (err, order) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(order);
                    if (d.getDate() > 20) {
                        res.render('rajorpay.ejs', { amount: order.amount, order_id: order.id });
                    }
                    else {
                        res.status(201).send("Bidding in progress")
                    }
                }
            });


        })
    } catch (err) {
        res.status(400).send("err");
    }
})
app.post("/verna", async (req, res) => {
    try {
        const bid = Product({
            fullName: req.body.myname,
            productName: "verna",
            mobile: req.body.mynumber,
            price: req.body.myprice
        })
        const prodName = await Product.findOne({ productName: "verna" })
        if (prodName.price < req.body.myprice) {
            var myquery = { productName: "verna" };
            var newvalues = { $set: { productName: "verna", fullName: req.body.myname, mobile: req.body.mynumber, price: req.body.myprice } };
            Product.updateOne(myquery, newvalues, function (err, res) {
                if (err) throw err;
            });
            res.render("bid_done");
        }
        else {
            res.status("201").send(`Highest bid is ${prodName.price}. Please enter price higher than this.`)
        }
        app.get("/payment", (req, res) => {
            var options = {
                amount: prodName.price,
                currency: 'INR',
            };
            rajorpay.orders.create(options, function (err, order) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(order);
                    if (d.getDate() > 20) {
                        res.render('rajorpay.ejs', { amount: order.amount, order_id: order.id });
                    }
                    else {
                        res.status(201).send("Bidding in progress")
                    }
                }
            });


        })
    } catch (err) {
        res.status(400).send("err");
    }
})
app.post("/sony", async (req, res) => {
    try {
        const bid = Product({
            fullName: req.body.myname,
            productName: "sony",
            mobile: req.body.mynumber,
            price: req.body.myprice
        })
        const prodName = await Product.findOne({ productName: "sony" })
        if (prodName.price < req.body.myprice) {
            var myquery = { productName: "sony" };
            var newvalues = { $set: { productName: "sony", fullName: req.body.myname, mobile: req.body.mynumber, price: req.body.myprice } };
            Product.updateOne(myquery, newvalues, function (err, res) {
                if (err) throw err;
            });
            res.render("bid_done");
        }
        else {
            res.status("201").send(`Highest bid is ${prodName.price}. Please enter price higher than this.`)
        }
        app.get("/payment", (req, res) => {
            var options = {
                amount: prodName.price,
                currency: 'INR',
            };
            rajorpay.orders.create(options, function (err, order) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(order);
                    if (d.getDate() > 20) {
                        res.render('rajorpay.ejs', { amount: order.amount, order_id: order.id });
                    }
                    else {
                        res.status(201).send("Bidding in progress")
                    }
                }
            });


        })
    } catch (err) {
        res.status(400).send("err");
    }
})
app.post("/samsung", async (req, res) => {
    try {
        const bid = Product({
            fullName: req.body.myname,
            productName: "samsung",
            mobile: req.body.mynumber,
            price: req.body.myprice
        })
        const prodName = await Product.findOne({ productName: "samsung" })
        if (prodName.price < req.body.myprice) {
            var myquery = { productName: "samsung" };
            var newvalues = { $set: { productName: "samsung", fullName: req.body.myname, mobile: req.body.mynumber, price: req.body.myprice } };
            Product.updateOne(myquery, newvalues, function (err, res) {
                if (err) throw err;
            });
            res.render("bid_done");
        }
        else {
            res.status("201").send(`Highest bid is ${prodName.price}. Please enter price higher than this.`)
        }
        app.get("/payment", (req, res) => {
            var options = {
                amount: prodName.price,
                currency: 'INR',
            };
            rajorpay.orders.create(options, function (err, order) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(order);
                    if (d.getDate() > 20) {
                        res.render('rajorpay.ejs', { amount: order.amount, order_id: order.id });
                    }
                    else {
                        res.status(201).send("Bidding in progress")
                    }
                }
            });


        })
    } catch (err) {
        res.status(400).send("err");
    }
})
app.post("/ps5", async (req, res) => {
    try {
        const bid = Product({
            fullName: req.body.myname,
            productName: "ps5",
            mobile: req.body.mynumber,
            price: req.body.myprice
        })
        const prodName = await Product.findOne({ productName: "ps5" })
        if (prodName.price < req.body.myprice) {
            var myquery = { productName: "ps5" };
            var newvalues = { $set: { productName: "ps5", fullName: req.body.myname, mobile: req.body.mynumber, price: req.body.myprice } };
            Product.updateOne(myquery, newvalues, function (err, res) {
                if (err) throw err;
            });
            res.render("bid_done");
        }
        else {
            res.status("201").send(`Highest bid is ${prodName.price}. Please enter price higher than this.`)
        }
        app.get("/payment", (req, res) => {
            var options = {
                amount: prodName.price,
                currency: 'INR',
            };
            rajorpay.orders.create(options, function (err, order) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(order);
                    if (d.getDate() > 20) {
                        res.render('rajorpay.ejs', { amount: order.amount, order_id: order.id });
                    }
                    else {
                        res.status(201).send("Bidding in progress")
                    }
                }
            });


        })
    } catch (err) {
        res.status(400).send("err");
    }
})
app.post("/oneplus", async (req, res) => {
    try {
        const bid = Product({
            fullName: req.body.myname,
            productName: "oneplus",
            mobile: req.body.mynumber,
            price: req.body.myprice
        })
        const prodName = await Product.findOne({ productName: "oneplus" })
        if (prodName.price < req.body.myprice) {
            var myquery = { productName: "oneplus" };
            var newvalues = { $set: { productName: "oneplus", fullName: req.body.myname, mobile: req.body.mynumber, price: req.body.myprice } };
            Product.updateOne(myquery, newvalues, function (err, res) {
                if (err) throw err;
            });
            res.render("bid_done");
        }
        else {
            res.status("201").send(`Highest bid is ${prodName.price}. Please enter price higher than this.`)
        }
        app.get("/payment", (req, res) => {
            var options = {
                amount: prodName.price,
                currency: 'INR',
            };
            rajorpay.orders.create(options, function (err, order) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(order);
                    if (d.getDate() > 20) {
                        res.render('rajorpay.ejs', { amount: order.amount, order_id: order.id });
                    }
                    else {
                        res.status(201).send("Bidding in progress")
                    }
                }
            });


        })
    } catch (err) {
        res.status(400).send("err");
    }
})
app.post("/jordans", async (req, res) => {
    try {
        const bid = Product({
            fullName: req.body.myname,
            productName: "jordans",
            mobile: req.body.mynumber,
            price: req.body.myprice
        })

        const prodName = await Product.findOne({ productName: "jordans" })
        if (prodName.price < req.body.myprice) {
            var myquery = { productName: "jordans" };
            var newvalues = { $set: { productName: "jordans", fullName: req.body.myname, mobile: req.body.mynumber, price: req.body.myprice } };
            Product.updateOne(myquery, newvalues, function (err, res) {
                if (err) throw err;
            });
            res.render("bid_done");
        }
        else {
            res.status("201").send(`Highest bid is ${prodName.price}. Please enter price higher than this.`)
        }
        app.get("/payment", (req, res) => {
            var options = {
                amount: prodName.price,
                currency: 'INR',
            };
            rajorpay.orders.create(options, function (err, order) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(order);
                    if (d.getDate() > 20) {
                        res.render('rajorpay.ejs', { amount: order.amount, order_id: order.id });
                    }
                    else {
                        res.status(201).send("Bidding in progress")
                    }
                }
            });


        })
    } catch (err) {
        res.status(400).send("err");
    }
})

app.post("/login", async (req, res) => {
    try {
        const email = req.body.myemail;
        const pass = req.body.myPassword;
        const useremail = await SignUp.findOne({ email: email });
        if (!useremail) {
            res.send(" login details")
        }
        else if (pass === useremail.password) {
            res.render("mainp")
        }
        else {
            res.send("Invalid login details")
        }
    } catch (err) {
        console.log(err)
    }
})


app.post("/forgot", async (req, res) => {
    try {
        const email = req.body.forgotEmail;
        const useremail = await SignUp.findOne({ email: email });
        if (!useremail) {
            res.send("Email does not exist");
        }
        else {
            let otp = Math.round(1000 + (9999 - 1000) * (Math.random()));
            otp = 7742
            let mailOptions = {
                from: "hsjaiswal3110@gmail.com",
                to: req.body.forgotEmail,
                subject: "Message from harsh jaiswal",
                text: `${otp}`
            }
            myInfo.sendMail(mailOptions, function (err, info) {
                if (err) {
                    console.log(err);
                } else {
                    res.status(200).send(info.response);
                }
            })
            res.status(201).render("forgotOTPGen");
            app.post("/forgotOTPGen", (req, res) => {
                if (otp == req.body.emailverify) {
                    res.status(201).render("setPassword");
                    app.post("/setPassword", async (req, res) => {
                        const password = req.body.forgotPass;
                        var myquery = { email: email };
                        var newvalues = { $set: { email: email, password: password, confirmpass: password } };
                        SignUp.updateOne(myquery, newvalues, function (err, res) {
                            if (err) throw err;
                        });

                        res.status(201).render("index")
                    })
                }
                else {
                    res.send("Invalid OTP")
                }
            })

        }
    } catch (err) {
        console.log(err);
    }
})


app.listen(port, () => {
    console.log(`Program executed successfull at port no ${port}`);
})