//the import tools
import express from 'express';//handles HTTP requests get post
import mongoose from 'mongoose';//let javascript talks to mongodb 
import cors from 'cors';//allow forntend and bbackend to talk to each other
//initializing app
const app=express();//creates server brain
//middleware /filters runs before request reaches routes
app.use(cors());//tells kay to accept requests from other domains (like your React dev server). 
app.use(express.json());//tells your server to automatically parse incoming data as JSON. Without this, req.body will be undefined
//database connection
mongoose.connect("mongodb://127.0.0.1:27017/churchCMS").then
(()=>console.log("MongoDB connected")).catch(err=>console.log(err));
app.listen(5000,()=>console.log("Server running on port 5000"));