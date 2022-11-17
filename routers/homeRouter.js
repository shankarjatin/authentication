

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
const transporter = nodemailer.createTransport({
    service:"hotmail",
    auth :{
        user: "shankarjatin1005@outlook.com",
        pass: "Jatin@1003"
    }
})

const options ={
    from: "shankarjatin1005@outlook.com",
    to: "ghostcoder16790@gmail.com",
    subject: "Sending enail with node.js!",
    text: "wow! That's simple!"
    };






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
                                    // const options ={
                                    //     from: "shankarjatin1005@outlook.com",
                                    //     to: useremail.email ,
                                    //     subject: "Sending enail with node.js!",
                                    //    html:'<h1>YOu have been Registered</h1><br><p>Welcome !</p>'
                                    
                                    //     };
                                      
                                    //         transporter.sendMail(options,  (err, info)=> {
                                    //             if(err){
                                    //             console.log(err);
                                    //             return;
                                    //             }
                                    //             console.log("Sent: " + info.response);
                                    //             })
                            
                                }
                               })
                   }
    }}
catch(e){
    console.log(e)
}})
// try{
//     const {
//         uname,
//         email,
//         password,
//         cpassword
//     }=req.body;
//     if(password===cpassword){
//        const  userData = new HomeSchema({
//         uname,
//         email,
//         password,
//        })
//        userData.save( err=>{
//         if(err){
//             console.log(err)
//         }else{
    
//             res.render("register",{title:"Done",password:"",email:""});

//         }
//        })


//        const useremail =await HomeSchema.findOne({email:email})
//        if(email===useremail.email){
//            res.render("register",{title:"",password:"",email:"USer exists"})
//        }
//        else{
//            console.log("error")
//        }

//     }
//     else{
//         res.render("register",{title:"",password:"password not matching",email:""})
//     }

// }catch(error){
//     res.render("register",{title:"Error in code",password:"",email:""})
    



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

Router.post("/login/user",async(req,res)=>{
    try{
        const nickname = req.body.nickname;
        HomeSchema.updateOne({email:req.body.email},{
            $set:{"nickname":nickname}
                 
        })
        .then(()=>{
            res.render("nickname")
        })
       
    //     const  userData1 = new HomeSchema({
    //         uname,
    //         email,
    //         nickname,
    //         pass
    // })
    // userData1.save().then(()=>{

    //         res.render("user");
    //     }
    //    );

}catch(error){
    console.log("error");
}
}
)








Router.get("/password" ,(req,res,next)=>{
    res.render("resetpassword")
})

Router.post("/password", async(req,res,next)=>{
    const uemail =req.body.email;
    
const user = await HomeSchema.findOne({email:uemail})
    console.log(user);
    emailn = user.email;
   console.log(emailn);
 
// {email:email}

// const user.password = HomeSchema.findOne({password:user.password})
// const user._id= HomeSchema.findOne({_id:user._id})
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
    const host ="http://localhost:8080/password/"
 const tokenlink = host.concat(token)
 const tokenlink1 = tokenlink+"/";
  const finaltoken =  tokenlink1.concat(email)
    const finaltoken1 = stringify(finaltoken);
    var referralTokenValue =  tokenlink1.concat(email)
const options ={
    from: "shankarjatin1005@outlook.com",
    to: user.email ,
    subject: "Sending enail with node.js!",
   html:'<p> Link to <a href="' + finaltoken + '">here</a></p> '
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

    
    HomeSchema.updateOne(where,update ,function(err,res){
       
    })
 
    

  }catch(e){
    console.log(e.message)
res.send(e.message)  }
})



module.exports = Router;
