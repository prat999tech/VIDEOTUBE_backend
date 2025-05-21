import cors from "cors"
import cookieParser from "cookie-parser" //use iska yeh ha ki jo user ke server se user ki cookies set or access kr pau
import express from "express"
const app=express()

app.use(cors({
    origin:process.env.CORS_ORIGIN, //cors humara middleware ke liye use hota ha or origin hume bta rha ha ki request kaha se aa rha 
    Credential:true
}))
////////////////////////////////////////////////////////////////

//abb data boht jaga se aayega kuch dataurl ke form m aayega kuch json ke format m aayega.. toh hum abb limit krenge apne request ko
app.use(express.json({limit:"10kb"}))//here to add middleware we use ".use" function and here we are adding middleware to limit the size of the data that can be sent in the request
app.use(express.urlencoded({extended:false,limit:"10kb"}))//here we are adding middleware, agar humare pass request url se aayi toh isko decode krne ke liye use krte ha or agr m "aap.use(express.urlencoded({limit:"10kb"}))" yeh bhi likhta tb bhi kaam ho jata
app.use(express.static("./public"))//agar kuch file ya images aayi unko store rkhne ke liye use krte h or usko store krne ke liye humne alg se public folder bnaya ha
app.use(cookieParser())//cookieParser middleware use krke hum cookie ko access kr skte h or set kr skte h or yeh as a object add ho jayega 'req' object m


////////////////////////////////////////////////////////////////////////////////////
  
///////////////////ROUTES////////////////////////
import userRouter from "./routes/user.routes.js"

///ROUTES DECLERATION////
//huum log app.get se nhi kr skte ha abb router ko laane ke liye middleware laaana pdega
//app.use() iska use krke hum router ko laate h
app.use("/api/v1/users",userRouter) //jaise hi kisi ne "/api/v1/users" likha toh control chla zyega "userRouters" pr wha se hum "user.routes.js" file pr chle jayenge
//yaha pr humara url agr humne users likha h "http://localhost:8000/api/v1/users"" toh iss url ke through control user controller file m chla jayega fir wha pr humne alg alg route likhe honge jaise hume agr register pr jaana ha ya contacts pr jaana
//"/api/v1/users"-yeh sirf likhna ka tarika ha

//routes import
import userRouter from './routes/user.routes.js'
import healthcheckRouter from "./routes/healthcheck.routes.js"
import tweetRouter from "./routes/tweet.routes.js"
import subscriptionRouter from "./routes/subscription.routes.js"
import videoRouter from "./routes/video.routes.js"
import commentRouter from "./routes/comment.routes.js"
import likeRouter from "./routes/like.routes.js"
import playlistRouter from "./routes/playlist.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js"

//routes declaration
app.use("/api/v1/healthcheck", healthcheckRouter)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/tweets", tweetRouter)
app.use("/api/v1/subscriptions", subscriptionRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/likes", likeRouter)
app.use("/api/v1/playlist", playlistRouter)
app.use("/api/v1/dashboard", dashboardRouter)
export {app};







//CORS (Cross-Origin Resource Sharing) allows a web application loaded in one domain to interact with resources in a different domain
//url se koi bhi data aata ha toh woh req.params ke through aata h
