import User from "../Models/userModels.js";
import bcryptjs from "bcryptjs";
import jwtToken from '../utils/jwtWebToken.js'

export const userRegister = async(req,res)=>{
    try{
        const {fullname,username,email,gender,password,profilepic} = req.body;
        //console.log(req.body);
        const user = await User.findOne({
            $or: [{ username }, { email }]
        });


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
            profilepic: gender == "male"? profileBoy : profileGirl
        })
        if(newUser){
            await newUser.save();
            //send data to JWT-create token at user register
            jwtToken(newUser._id , res)
        }else{
            res.status(500).send({
                success:false,
                message :"Invalid User Data"
            })
        }

        // send user data to frontend
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

// login logic
export const userLogin = async(req,res)=>{
    try{
        const {email , password} = req.body;
        //see if the user already exists
        const user = await User.findOne({email});

        //if doesn't exist...
        if(!user){
            return res.status(500).send({
                success : false,
                message : "Email doesn't exist, Register!"
            })
        }
        //now, compare the 2 passwords
        const comparePass = bcryptjs.compareSync(password , user.password || "")

        if(!comparePass){
            res.status(500).send({
                success:false,
                message :"Email or Password doesn't match"
            })
            
        }
         //send data to JWT-create token at user LOGIN
        jwtToken(user._id , res)
        res.status(200).send({
            _id : user._id,
            fullname : user.fullname,
            username : user.username,
            profilepic : user.profilepic,
            email : user.email    ,
            message : "Logged in Successfully"            
        })
    }
    catch(error){
         res.status(500).send({
            success : false,
            message : error
        })
        console.log(error)
    }
}

export const userLogout = async(req , res)=>{
    try{

        res.cookie("jwt" , '',{
            maxAge : 0
        })
        res.status(200).send({
            message: "Logged Out"
        })

    }
    catch(error){
        res.status(500).send({
            success : false,
            message : error
        })
        console.log(error)
    }
}

