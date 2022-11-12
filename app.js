const express = require ("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const homeRouter = require("./routers/homeRouter");
const mongodb = require("mongodb")
const port = process.env.port || 8080 ;

const DB = "mongodb+srv://shankarjatin:jaiHanumanji@cluster0.b1no4tl.mongodb.net/userData?retryWrites=true&w=majority";
const app = express();

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