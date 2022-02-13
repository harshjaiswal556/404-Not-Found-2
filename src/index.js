const express = require("express");
const hbs = require("hbs");
const path = require("path");
const nodemailer = require("nodemailer");
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
const product = require("./models/product");

const templatePath = path.join(__dirname, "./templates");
app.set("view engine", "hbs");
app.set("views", templatePath);
app.use(express.static(templatePath));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.get("/",(req,res)=>{
    res.render("homePage")
})
app.get("/index",(req,res)=>{
    res.render("index")
})
app.get("/emailVerification", (req, res) => {
    res.render("emailVerification")
})
app.get("/forgot",(req,res)=>{
    res.render("forgot")
})
app.get("/forgotOTPGen",(req,res)=>{
    res.render("forgotOTPGen")
})
app.get("/setPassword",(req,res)=>{
    res.render("setPassword")
})
app.get("/phone11",(req,res)=>{
    res.render("phone11")
})
app.get("/practice",(req,res)=>{
    res.render("practice")
})
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
            const otp = Math.round(1000 + (9999 - 1000) * (Math.random()));
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
                if (otp == req.body.emailverify) {
                    res.status(201).render("mainp")
                    const result = registerStd.save();
                }
                else {
                    res.send("Invalid OTP")
                }
            })
        }
        else {
            res.send("Password not matched");
        }
    }catch(err){
        res.status(400).send(err);
    }
    
})

app.post("/phone11",(req,res)=>{
    try{
            const bid = product({
                fullName : req.body.myname,
                productName : "iphone11",
                mobile : req.body.mynumber,
                price : req.body.myprice
            })
                        var myquery = { productName:"iphone11" };
                        var newvalues = { $set: { productName: "iphone11",fullName: req.body.myname,mobile: req.body.mynumber ,price: req.body.myprice } };
                        product.updateOne(myquery, newvalues, function (err, res) {
                            if (err) throw err;
                        });
            res.status(201).send("bid done")
    }catch(err){
        res.status(400).send("err");
    }
})

app.post("/login",async(req,res)=>{
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
            const otp = Math.round(1000 + (9999 - 1000) * (Math.random()));
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
                        var myquery = { email:email };
                        var newvalues = { $set: { email: email, password: password, confirmpass :password } };
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