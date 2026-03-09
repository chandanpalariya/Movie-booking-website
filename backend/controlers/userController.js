import User from '../models/userModal.js' 
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config();


const JWT_SECRET=process.env.JWT_SECRET
const TOKEN_EXPIRES_IN='24h';


const emailIsValid = (e) => /\S+@\S+\.\S+/.test(String(e || ""));
const extractCleanPhone = (p) => String(p || "").replace(/\D/g, "");
const mktoken=(payload)=>jwt.sign(payload,JWT_SECRET,{expiresIn:TOKEN_EXPIRES_IN});

// register function

export const registerUser=async(req,res)=>{

    try{
        const  {fullName,username,phone,email,birthDate,password}=req.body || {};
        if(!fullName || !username ||!email ||!phone || !birthDate ||!password){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }

        if(typeof fullName !== 'string' || fullName.trim().length<2 ){
            return res.status(400).json({
                success:false,
                message:"full name must be atleast 2 character"
            })
        }

        if(typeof username !=='string' || username.trim().length<3){
            return res.status(400).json({
                success:"false",
                message:"username must be atleast 3 charater"
            })
        }
         
        if(!emailIsValid(email)){
            return res.status(400).json({
                success:false,
                message:"Email is invalid"
            })
        }

        const cleanedPhone=extractCleanPhone(phone);

        if(cleanedPhone.length<6){
            return res.status(400).json({
                success:false,
                message:"phone number seems invalid"
            })
        }

        if(!password || password.length < 6){
            return res.status(400).json({
                success:false,
                message:"password must be atleast 6 character long"
            })
        }

        const parseBirth=new Date(birthDate);
        if(Number.isNaN(parseBirth.getTime())){
            return res.status(400).json({
                success:false,
                message:"Birth date invalid"
            })
        }

        const existingByEmail=await User.findOne({email: email.toLowerCase().trim()});

        if(existingByEmail) {
            return res.status(400).json({
                success:false,
                message:"Email already exists"
            })
        }

        const existingByusername=await User.findOne({username:username.trim().toLowerCase()})
        if(existingByusername) return res.status(400).json({
            success:false,
            message:"username already in use."
        })

        // hash the password

        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);
        const newUser=await User.create({
            fullName: fullName.trim(),
            username: username.trim(),
            email: email.toLowerCase().trim(),
            phone: phone,
            birthDate: parseBirth,
            password: hashedPassword
        })

        const token=mktoken({
            id:newUser._id
        })

        const userToReturn={
            id:newUser._id,
            fullName:newUser.fullName,
            username:newUser.username,
            email:newUser.email,
            phone:newUser.phone,
            birthDate:newUser.birthDate



        }

        return res.status(201).json({
            success:true,
            message:"user registered successfully!",
            token,
            user:userToReturn
        });
    }
        
  
        

    

    catch(err){
        console.error("Register error:",err);
        if(err.code===11000){
            const dupkey=Object.keys(err.keyValue ||{})[0];
            return res.status(400).json({
                success:false,
                message:`${dupkey} already exists.`
            })

        }
        return res.status(500).json({
            success:false,
            message:"server error"

        })

    }

    

}


  //login function

  export async function login(req,res) {
    try{
        const {email,password}=req.body ||{};

        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"ALL field are required"
            })
        }

        const user=await User.findOne({email});
        if(!user) return res.status(401).json({
            success:false,
            message:"Inavalid email or password"

        })

        const isMatch=await bcrypt.compare(password,user.password);

        if(!isMatch) return res.status(401).json({
            success:false,
            message:"invalid email or password"
        })

        const token=mktoken({id:user._id.toString()})

        return res.status(200).json({
            success:true,
            message:"login succesfully",
            token,
            user:{
                id:user._id.toString(),
                name:user.name,
                email:user.email
            }
        })

    }

    catch (err){
        console.log("Login error:",err);
        return res.status(500).json({
            success:false,
            message:'Server Error'
        })


    }
    
  }


