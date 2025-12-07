import { Request, Response } from "express";
import { UserService } from "./user.service";
import { pool } from "../../config/DataBase";




const getAllUsers =  async (req: Request, res: Response) => {
  try {
    const result = await UserService.getAllUsers()

    const UsersWithoutPassword = result.rows.map((user : any)=>{
        const {password,...safeUser} = user;
        return safeUser
    })

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: UsersWithoutPassword,
    });

  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}


const updateUser = async (req: Request, res: Response) => {
  try {

    const result = await UserService.updateUser(req.body,req.params.userId!)

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found 😞",
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data : result.rows[0]
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

const deleteUser = async (req: Request, res: Response) => {
  try {
    const result = await UserService.deleteUser(req.params.userId!)

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found 😞",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });

  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}


export const UserController = {
  getAllUsers,
  updateUser,
  deleteUser
};
