import express from "express";
import Auth from '../models/authM.js'
import multer from 'multer'
import * as path from 'path';
import fileUpload from 'express-fileupload'
import { v2 as cloudinary } from 'cloudinary'
import { url } from "inspector";

const authrouter = express.Router()

cloudinary.config({

  cloud_name:'dcnjdzs3a',
  api_key:'447923356924346',
  api_secret:'BEN6Khh0nmN-8i2bLms5mkFyxLo'
})


//FILE STORAGE QUERY START........................
const storage = multer.diskStorage({
  //  destination: './public/assets/images',
  
  filename: (req, file, cb) => {
      cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
    }
});
//FILE STORAGE QUERY END....................................................................................


//FILE FILTER QUERY START....................................................................................
const filefilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' 
      || file.mimetype === 'image/jpeg' || file.mimetype === 'application/pdf'){
          cb(null, true);
      }else {
          cb(null, false);
      }

}
const upload= multer({storage:storage, fileFilter:filefilter})
//post method..................
authrouter.post("/post", async (req, res) => {
    try{
const file= req.files.Photo
cloudinary.uploader.upload(file.tempFilePath,(err,result)=>{

    const files = new Auth({
        // Photo: result.url,
        Photo: result.secure_url,
        cloudinary_id: result.public_id,
        Name: req.body.Name,
        Post:req.body.Post,
        Description:req.body.Description,
        Active:req.body.Active
  
      });
      
     files.save();
    res.status(200).send(files);
  })
}catch(error) {
    res.status(400).send("please fill the data");
 }
})

authrouter.get("/get", async (req, res) => {
  try {
    let user = await Auth.find({});
    res.json(user);
  } catch (err) {
    console.log(err);
  }
});

//get by id method..................................
authrouter.get("/get/:id",async(req,res)=>{

  try{
  const _id= req.params.id
  const details= await Auth.findById(_id)

  res.status(200).send(details)
}
  catch(err)
  {
    res.status(400).send("error")
  }
})

//update details..........................................
authrouter.put("/update/:id", async (req, res) => {
  try {
    const file= req.files.Photo

    let user = await Auth.findById(req.params.id);
    // Delete image from cloudinary
    const dis= await cloudinary.uploader.destroy(file.tempFilePath);
    // Upload image to cloudinary
    let result;
    if (dis) {
      result = await cloudinary.uploader.upload(file.tempFilePath);
    }
    const data = {
      Name: req.body.Name || user.Name,
      Post: req.body.Post || user.Post,
      Description: req.body.Description || user.Description,
      Active: req.body.Active || user.Active,
      Photo: result?.secure_url || user.Photo,
      cloudinary_id: result?.public_id || user.cloudinary_id,
    };
    user = await Auth.findByIdAndUpdate(req.params.id, data, { new: true });
    res.status(200).send(user);
  } catch (err) {
    console.log("err");
  }
});

//delete method ......................................
authrouter.delete("/delete/:id", async (req, res) => {
  try {
    // Find user by id
    let user = await Auth.findById(req.params.id);
    // Delete image from cloudinary
    await cloudinary.uploader.destroy(user.cloudinary_id);
    // Delete user from db
    await user.remove();
    res.status(200).send(user);
  } catch (err) {
    console.log("err");
  }
});
export default authrouter