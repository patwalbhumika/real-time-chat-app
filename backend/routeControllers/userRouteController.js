import User from "../Models/userModels.js";
import bcryptjs from "bcryptjs";

export const userRegister = async(req,res)=>{
    try{
        const {fullname,username,email,gender,password,profilepic} = req.body;
        //console.log(req.body);
        const user = await User.findOne({username,email});

        // handle alerady existing user
        if(user){
            return res.status(500).send({
                    success :false,
                    message : "username or email already exists"
            });            
        }
                
        // hash the password for security
        const hashPassword = bcryptjs.hashSync(password , 10);

        // set avatar to profile pic
        const profileBoy = profilepic || `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const profileGirl = profilepic || `https://avatar.iran.liara.run/public/girl?username=${username}`;

        // save to database
        const newUser = new User({
            fullname ,
            username,
            email,
            password:hashPassword,
            gender,
            profile: gender == "male"? profileBoy : profileGirl
        })
        if(newUser){
            await newUser.save();
        }else{
            res.status(500).send({
                success:false,
                message :"Invalid User Data"
            })
        }

        // send to frontend
        res.status(201).send({
            _id : newUser._id,
            fullname : newUser.fullname,
            username : newUser.username,
            profilepic : newUser.profilepic,
            email : newUser.email
        })
    }catch(error){
        res.status(500).send({
            success : false,
            message : error
        })
        console.log(error)
    }
}