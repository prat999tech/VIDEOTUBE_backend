/*import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js';
 

const connectDB = async () => {
    try{
        const connectioninstance=await mongoose.connect('${process.env.MONGODB_URL}/${DB_NAME}')//yaha connectioninstance variable issliye bnaya, connection hone ke baad responses ko yeh variable hold krlega
        console.log('\n MONGODB CONNECTED !! DB HOST:${connectioninstance.connection.host}}');// 'connectioninstance.connection.host' isse hume pta rhega ki kone host se connect ho rha hu
    }
    catch(error){
        console.log(error);
        process.exit(1); //This indicates that the process has exited due to an error or failure.

        
    }

}
export default connectDB
*/
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1)
    }
}

export default connectDB