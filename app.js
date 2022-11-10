const express = require ("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const homeRouter = require("./routers/homeRouter");
const port = process.env.port || 8080 ;

const DB = "mongodb+srv://shankarjatin:Hanumanji%4010@cluster0.6moss5j.mongodb.net/?retryWrites=true&w=majority/User_info";
const app = express();

mongoose.connect(DB).then(()=>{
    console.log("connection successful");
}).catch((err) => console.log("connection failed") );

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())


app.use("/", homeRouter);



app.listen(port);