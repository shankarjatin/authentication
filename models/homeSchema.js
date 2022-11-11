const mongoose = require("mongoose");
const schema = mongoose.Schema;

const userSchema = new schema({
    uname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
});
const Userinfo = new mongoose.model('Registeruser', userSchema);

module.exports = Userinfo;




// ("Regi",User_info);