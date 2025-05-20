import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const commentschema=new mongoose.Schema({
    comment:{
        type:String,
        required:true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    video:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Video"
    }

},{timestamps:true})
commentschema.plugin(mongooseAggregatePaginate)

export const Comment=mongoose.model("Comment",commentschema)