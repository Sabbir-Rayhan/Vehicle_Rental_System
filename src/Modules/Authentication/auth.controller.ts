import { Request,Response } from "express";
import { AuthServices } from "./auth.service"

const SigninUser = async (req: Request,res: Response)=>{
    try{
        const result = await AuthServices.SigninUser(req.body)
        const {user,token} = result;

        const {password,...dataWithOutPassword} = user

        res.status(200).json({
          success: true,
          message: "Login Successful",
          data : {
            token,
            user : dataWithOutPassword
          }
        });
    }catch(err : any){
        res.status(404).json({
            success : false,
            message : err.message
        })
    }
}



const CreateUser = async (req : Request,res : Response)=>{
  try{
    const result = await AuthServices.userSignup(req.body);
    const data = result.rows[0];

    const {password,...withoutpassword} = data
    res.status(201).json({
      success : true,
      message : "User registered successfully",
      data : withoutpassword
    })
  }catch(err){
    res.status(500).json({
      sucess : false
    })
  }
}

export const AuthController = {
    SigninUser,
    CreateUser
}