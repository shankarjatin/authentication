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
    nickname:{
        type:String,
        required:false
    },
    // name:{
    //     type:String,
    //     required:true
    // },
    password:{
        type:String,
        required:true
    }
});
const Userinfo = new mongoose.model('Userinfo', userSchema);

module.exports = Userinfo;




// ("Regi",User_info);