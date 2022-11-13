

const express = require("express");
const Router  = express.Router();
const HomeSchema = require("../models/homeSchema");
// const Token = require("../models/token");
const crypto = require("crypto");
// const sendEmail = require("../utils/sendEmail");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
const bcrypt = require("bcrypt");
const mailgun = require("mailgun-js");
const bodyParser = require("body-parser");
const DOMAIN = 'sandboxf5f766617900462a9ccd109ead7478d2.mailgun.org';
const mg = mailgun({apiKey: "7e35b47bab804aaee3ad19a962c5a811-48c092ba-71d0e176", domain: DOMAIN });

Router.get("/", (req,res)=>{
res.render("register",{title:"fill form",password:"",email:""})})

Router.post("/signup",async(req,res)=>{
try{
    const {
        uname,
        email,
        password,
        cpassword
    }=req.body;
    if(password===cpassword){
       const  userData = new HomeSchema({
        uname,
        email,
        password,
       })
       userData.save( err=>{
        if(err){
            console.log(err)
        }else{
    
            res.render("register",{title:"Done",password:"",email:""});

        }
       })

const useremail = HomeSchema.findOne({email:email})
if(email===useremail.email){
    res.render("register",{title:"",password:"",email:"USer exists"})
}
else{
     const data = {
                from: 'iam <no-reply@hello.com>',
                to: email,
                subject: 'Hello',
                text: 'Testing some Mailgun awesomness!'
            };
            mg.messages().send(data, function (error, body) {
                console.log(body);
            });
    
}

    }
    else{
        res.render("register",{title:"",password:"password not matching",email:""})
    }

}catch(error){
    res.render("register",{title:"Error in code",password:"",email:""})
    

}});

Router.post("/login", (req,res)=>{
    const {
        email,
        password
    }= req.body;

    HomeSchema.findOne({email:email},(err,result)=>{
       if(email===result.email && password===result.password){
        res.render("user",{ name: result.uname})
       }
       else{
        console.log(err);
       }
    })
})


Router.post("/login/user",async(req,res)=>{
    try{
       const nickname = nickname.req.body;
        const  userData1 = new HomeSchema({
           nickname
    })
    userData1.save((req,res)=>{
        
            res.render("user");
        }
       )

}catch(error){
    console.log("error");
}
}
)




module.exports = Router;
