require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');

mongoose.set('strictQuery', true);
mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
    email:String,
    password:String
});

const secrets = process.env.SECRET;
userSchema.plugin(encrypt,{secret:secrets, encryptedFields:["password"]});

const User = mongoose.model("user",userSchema);

app.get("/",function(req,res){
    res.render("home");
})

app.get("/login",function(req,res){
    res.render("login");
})

app.get("/register",function(req,res){
    res.render("register");
})

app.post("/register",function(req,res){
    const user = new User({
        email:req.body.username,
        password:req.body.password
    });

    user.save(function(err){
        if(err){
            console.log(err);
        }else{
            res.render("secrets");
        }
    })
})

app.post("/login",function(req,res){
    User.findOne({email:req.body.username},function(err,user){
        if(user){
            if(user.password == req.body.password){
                res.render("secrets");
            }else{
                console.log("the password is incorrect");
            }
        }else{
            console.log("no similar email found");
        }
    })
})

app.listen(3000,function(){
    console.log("the server has stated at port 3000");
})
