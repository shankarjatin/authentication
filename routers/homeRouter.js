const express = require("express");
const Router  = express.Router();
const HomeSchema = require("../models/homeSchema");
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
            console.log("err")
        }else{
            res.render("register",{title:"Done",password:"",email:""})

        }
       })

const useremail =await HomeSchema.findOne({email:email})
if(email===useremail.email){
    res.render("register",{title:"",password:"",email:"USer exists"})
}
else{
    console.log("error")
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

module.exports = Router;

