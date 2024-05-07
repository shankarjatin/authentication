const express = require ("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const homeRouter = require("./routers/homeRouter");
const dotenv = require("dotenv")
const mongodb = require("mongodb")
const ejs = require('ejs')
const port = process.env.PORT || 7000 ;
dotenv.config();

const DB = "mongodb+srv://shankarjatin1005:nYdr2TsoY4NXfCnm@cluster0.subvhvu.mongodb.net/authentication";
const app = express();
const jwt = require("jsonwebtoken");
// const JWT_SECRET = "scedcdcdscv";
// const jwtS= require(JWT_SECRET);
const nodemailer = require("nodemailer");


// const transporter =nodemailer.createTransport(sendgridTranport({
//     auth:{
//         api_key:"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"
//     }
// }))
mongoose.connect(DB,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("connection successful");
}).catch((err) => console.log(err) );

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())


app.use("/", homeRouter);



app.listen(port);
// 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