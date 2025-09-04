import mongoose from "mongoose";

const dbConnect = async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_CONNECT)
        console.log("DB connect Successfully!!!~");   
    }catch(error){
        console.log("DB Connection FAILED: ",error.message);
    }
}

export default dbConnect;