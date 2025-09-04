import express from "express"
import dotenv from 'dotenv'
import dbConnect from "./DB/dbConnect.js";
import authRouter from './route/authUser.js'

const app = express();

dotenv.config();

// to make server accept JSON data too(for postman checking)
app.use(express.json());

app.use('/api/auth' , authRouter)

app.get('/',(req , res)=>{
    res.send("Server is working~");

})



const PORT = process.env.PORT || 3000

app.listen(PORT , ()=>{
    dbConnect();
    console.log(`Working at ${PORT} HERE!!`);
})