import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'; // we used to encrypt and decrypt password

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true, 
        index: true //it helps in searching in database
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true, 
        
    },
    fullName: {
        type: String,
        required:true,
        trim: true, 
        index: true //it helps in searching in database
    },
    avatar:{
        type: String, //here we save url from third party
        required: true,
    },
    coverImage:{
        type: String, //here we save url from third party
    },
    watchHistory:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    password:{
        type: String,
        required:[true,'password is required']
    },
     refreshToken:{
        type: String,
     }


},{timestamps:true})
/////////////////////////////////////////////////////////////////////////////////////////////
userSchema.pre("save",async function(next){ //yeh('.pre()') ek event listener ki trh use hota ha jb bhi mera data save ho rha ha usse phlle mera password encrypt hoga
    if(!this.isModified("password")) return next(); //agar mera password modify nhi hua ha toh aagr badh jao

          this.password= await bcrypt.hash(this.password,10);
    next()
})  
//humne this.password se password ka reference lia ha or 'next()' humne next ko call kia taaki process aage badh jaye
/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////
//yaha hum check krenge ki password sahi ya nhi or iske liye custom method design krenge
userSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password)
}
//yeh '.compaer(). return krta ha true or false
//password-jo password user dalega string m
//this.password-jo humara encrypted password ha

///////////////////////////////////////////////////////////////



userSchema.methods.generateAccessToken = function(){
    return jwt.sign({//sbse phle .sign() function m dunga payload mtlb kon kon se information m rkhna chahta hu or phir access token return kr dega
         _id:this.id,
         email:this.email, // jo hum this. se la rhe h woh database se aa rha ha
         username:this.username,
         fullName:this.fullname,
    },
process.env.ACCESS_TOKEN_SECRET,
{
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY
})
} // .sign() method humara access token generate krta ha 





userSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
         _id:this.id,
         
    },
process.env.REFRESH_TOKEN_SECRET,
{
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY
})
}


export const User = mongoose.model('User',userSchema);

//JWT eek bearer token ha mtlb yeh token jiske pass ha usko mai data bhej dunga
//Its purpose is to be used by the JWT (jsonwebtoken) library to cryptographically sign your Access Tokens. Think of it like a unique stamp or seal. Only someone with this secret key can create a token with this specific valid stamp, and only someone with this secret key can verify that a token's stamp is legitimate and hasn't been tampered with



