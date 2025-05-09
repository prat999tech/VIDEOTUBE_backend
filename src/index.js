//always handle database with try catch or promises
//always handle database with async await

//our second approach is we write our database connection code in db folder and then export our code to index file



import connectDB from"./db/index._db.js";
//require('dotenv').config({path:'./env'})
import dotenv from 'dotenv';
import {app} from "./app.js"
dotenv.config({ path: './env' });

connectDB()
/////////////////////////////////////////////////////////////////////
//in db file we write database connection  async function and async returns promise so if there is error in connecting to db we handle with .then as async returns promise so we use .then and in .then hum log jo app.js m app bna rhe ha usko listen krenge taaki humari application(app) database ko listen krr paye or .catch ka use krenge agr database connection nhi hua ha usko handle krne ke liye
.then(()=>{
    app.listen(process.env.PORT||8000,() => {
        console.log(`app is listening on port ${process.env.PORT}`);
        
    })
    
})
.catch((error)=>{
    console.log("mongo db connection failed!!!",error)
})
//iss block m jitna bhi code ha yeh jb humara database connect ho jata phir hum app ko listen krenge taaki yeh humare database ko listen kr paye 

///////////////////////////////////////////////////



/*
this is our first approach to connect to database
import mongoose from "mongoose";
import { DB_NAME } from "./constants";//we import db name from constants file

import express from "express";
const app=express()
// to make code more professional we use IIFE
(async () => {
    try{
     await mongoose.connect(${process.env.MONGO_URL}/${DB_NAME}) //here we are connecting to database
     //app.on eek listener event ha jo humare app ko listen krti ha or agr error aaya ki app humara database se connect nhi hua tb yeh use hota ha
    app.on("error",(error) => {        

        console.log("error",error);
        throw error
        app.listen(process.env.PORT,()=>{
            console.log("app is listening on port"${process.env.PORT});
        })
    })
    }
    catch(error){
        console.log(error)
        throw err
    }
})()
    */

