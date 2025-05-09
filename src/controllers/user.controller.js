import  {asyncHandler}  from "../utils/asynchandler.js";

const registerUser=asyncHandler(async (req,res)=>{
    return res.status(200).json({
        message:"User registered successfully"
    })//yaha pr humne "asynchandler" eek higherorder function bnaya ha jo accept kr rha h "async" function fir uss function m humne response status 200 dia ha or woh humne json format m dia ha or 200 response status mtlb hota ha "OK"
})
//controller method run jb hoga jb koi url hit hoga or woh sbb kaam hum routes m krte ha
export {registerUser}
// jo bhi router or controller se export ho rha ha usko hum zyadar app.js m import krte ha


