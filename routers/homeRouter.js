const express = require("express");
const Router  = express.Router();

Router.get("/", (req,res)=>{
res.render("register",{title:"fill form",password:"",email:""})})

Router.post("/signup",async(req,res)=>{
try{
    const {
        uname,
        email,
        password,
        cpassword
    }= req.body;
    if(password===cpassword){
        console.log("okay")
    }
    else{
        res.render("register",{title:"",password:"password not matching",email:""})
    }

}catch(error){
    res.render("register",{title:"Error in code",password:"",email:""})
    

}});

module.exports = Router;

