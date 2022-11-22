import  express  from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv'
import bodyParser from "body-parser";
import cors from "cors";
import authrouter from './routes/auth.js'
import fileUpload from 'express-fileupload'



dotenv.config()


const app=express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

// midleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.use(fileUpload({
    useTempFiles:true
}))


app.use(cors())

// routes
app.use("/",authrouter)


const PORT=process.env.PORT||3000
// connect mongo db atlas
mongoose.connect(process.env.MONGO_URL,{usenewurlparser:true,}).then(()=>{
    console.log("connected to mongodb atlas")
}).catch(error=>{
console.log("something wrong")
})

// server port
app.listen(PORT,()=>{
    console.log("server started at port http://localhost:3000");
})

// Function to serve all static files
// // inside public directory.
// app.use(express.static('public')); 
// app.use('/images', express.static('images'));