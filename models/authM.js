import mongoose from "mongoose";
var Schema= mongoose.Schema
 
const authSchema=new mongoose.Schema({

   
    Name:{
        type:String,
        },
    Photo:{
        type: String,
        },
    cloudinary_id: {
        type: String,
          },
    Post:{
        type:String,
    }, 
    Description:{
        type:String,
        },
    Active:{
        type:Number
    }
},{versionKey: false})    

authSchema.set('timestamps',{
    createdAt:"Created On",
    updatedAt:'Last Update On'
});

const Auth=mongoose.model('cloudinary',authSchema)

export default Auth