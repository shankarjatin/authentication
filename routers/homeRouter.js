

const express = require("express");
const Router  = express.Router();
const HomeSchema = require("../models/homeSchema");
// const Token = require("../models/token");
const crypto = require("crypto");
// const sendEmail = require("../utils/sendEmail");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
// const bcrypt = require("bcrypt");
const mailgun = require("mailgun-js");
const bodyParser = require("body-parser");
const DOMAIN = 'sandboxf5f766617900462a9ccd109ead7478d2.mailgun.org';
const mg = mailgun({apiKey: "7e35b47bab804aaee3ad19a962c5a811-48c092ba-71d0e176", domain: DOMAIN });
const JWT_SECRET ="iamsuperheroSecret"
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer");
const { stringify } = require("querystring");
const { link } = require("joi");

// nodemailer authentication

const transporter = nodemailer.createTransport({
    service:"hotmail",
    auth :{
        user: "shankarjatin1005@outlook.com",
        pass: "Jatin@1003"
    }
})


// home Router

Router.get("/", (req,res)=>{
res.render("register",{title:"fill form",password:"",email:""})})



// signup router

Router.post("/signup",async(req,res)=>{
    try{
            const {
                uname,
                email,
                password,
                cpassword
            }=req.body;
            
            const useremail =await HomeSchema.findOne({email:email})
                //    if(email===useremail.email){
                    if(useremail){ 
                       res.render("register",{title:"",password:"",email:"USer exists"})
                   }
                   else{
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
                                    const useremail = HomeSchema.findOne({email:email})
                                    const options1 ={
                                        from: "shankarjatin1005@outlook.com",
                                        to: req.body.email,
                                        subject: "Sign-up Notification!",
                                       html:'<h1>You have been Registered</h1><br><h1>Welcome !</h1>'
                                    
                                        };
                                      
                                            transporter.sendMail(options1,  (err, info)=> {
                                                if(err){
                                                console.log(err);
                                                return;
                                                }
                                                console.log("Sent: " + info.response);
                                                })
                     res.render("register",{title:"User Added",password:"",email:""});
                                }
                               })
                   }
    }}
catch(e){
    console.log(e)
}})


// login router

Router.post("/login", (req,res)=>{
    console.log(req.body)
    const {
        email,
        password
    }= req.body;

    HomeSchema.findOne({email:req.body.email},(err,result)=>{
        console.log(result)
        console.log(result.email)
       if(req.body.email===result.email && req.body.password===result.password){
        res.render("user",{ name:result.uname , email:result.email})
       }
       else{
        console.log(err);
       }
    })
})

// user dashboard

Router.post("/login/user",async(req,res)=>{
    try{
        const nickname = req.body.nickname;
        HomeSchema.updateOne({email:req.body.email},{
            $set:{"nickname":nickname}
                 
        })
        .then(()=>{
            res.render("nickname")
        })
       

}catch(error){
    console.log("error");
}
}
)





// password reset 


Router.get("/password" ,(req,res,next)=>{
    res.render("resetpassword")
})

Router.post("/password", async(req,res,next)=>{
    const uemail =req.body.email;
    
const user = await HomeSchema.findOne({email:uemail})
    console.log(user);
    emailn = user.email;
   console.log(emailn);
 

    if(user.email !== uemail){
        res.send("user not registered");
        return;
    }
    const secret =JWT_SECRET+user.password;
    const payload={
        emailn: user.email,
        id: user._id
    }
    const email = user.email
    const token =jwt.sign(payload,secret,{expiresIn:"15m"})
    const host ="https://user-authentication-jatin.herokuapp.com/password/"
 const tokenlink = host.concat(token)
 const tokenlink1 = tokenlink+"/";
  const finaltoken =  tokenlink1.concat(email)
    const finaltoken1 = stringify(finaltoken);
    var referralTokenValue =  tokenlink1.concat(email)
const options ={
    from: "shankarjatin1005@outlook.com",
    to: user.email ,
    subject: "Reset password",
   html:'<p> TO resset click<a href="' + finaltoken + '">here</a></p> '
    };

    transporter.sendMail(options,  (err, info)=> {
        if(err){
        console.log(err);
        return;
        }
        console.log("Sent: " + info.response);
        })

    console.log(finaltoken);
    res.send("password rest link has been sent")
})

Router.get("/password/:token/:email",async (req,res,next)=>{
    const{email ,token}=req.params;
    // res.send(req.params);
    const user = await HomeSchema.findOne({email:email})
    if(!user){
        res.send("invalid user")
        return
    }
    
        const secret = JWT_SECRET+user.password
        try{
            const payload= jwt.verify(token,secret)
            res.render("resetyourpassword",{email:email})

        }catch(e){
            console.log(e);
        }
    
})

Router.post("/password/:token/:email", async(req,res,next)=>{
    const{email,token}=req.params;
    const user = await HomeSchema.findOne({email:email})

    const{password1,password2}=req.body
  if(email!==user.email){
    res.send("invalid user")
  }

  const secret = JWT_SECRET+user.password
  try{
    const payload=jwt.verify(token,secret)
let password1 = req.body.password1;
var where = {email:user.email};
var update = { $set:{password:password1}};

    
    HomeSchema.updateOne(where,update ,function(err,res)
   {
    
    }).then(()=>{
        res.render("passwordre");
    })
    

  }catch(e){
    
  console.log(e.message)
res.send(e.message)  }
  
})



module.exports = Router;
