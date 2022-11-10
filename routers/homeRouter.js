const express = require("express");
const Router  = express.Router();

Router.get("/", (req,res)=>{
res.render("register",{title:"fill form"})})



module.exports = Router;

