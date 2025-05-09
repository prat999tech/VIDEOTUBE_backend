//always handle database with try catch or promises
//always handle database with async await

//our second approach is we write our database connection code in db folder and then export our code to index file


/*
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
*/

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
///////GEMINI CODE//////
// Load environment variables from .env file
import dotenv from 'dotenv';
dotenv.config({ path: './env' });

// Import the database connection function
import connectDB from './db/index._db.js';

// Import the Express application instance
// We will import it inside the .then block to ensure Mongoose is initialized
// import { app } from './app.js'; // <-- Comment out or remove this import here

// Connect to the database
connectDB()
    // If the database connection is successful, then start the application server
    .then(() => {
        // Import the app here, after the database connection is established.
        // This ensures that any files imported by app.js (like models)
        // will be processed when Mongoose is ready.
        import('./app.js')
            .then(({ app }) => { // Use dynamic import and destructure 'app'
                // Start the Express application server
                app.listen(process.env.PORT || 8000, () => {
                    console.log(`⚙️ Server is running on port : ${process.env.PORT || 8000}`);
                });
            })
            .catch((err) => {
                console.error("Express App startup failed:", err);
                // Exit the process if the app fails to start after DB connection
                process.exit(1);
            });
    })
    // If the database connection fails, log the error and exit the process
    .catch((error) => {
        console.log("MongoDB connection FAILED !!!", error);
        process.exit(1); // Exit the process on database connection failure
    });

