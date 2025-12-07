import { error } from "console";
import { pool } from "../../config/DataBase"
import bcrypt from "bcryptjs";


const getAllUsers = async()=>{
    const result = await pool.query(`SELECT * FROM users`);
    return result
}


const updateUser = async(payload : Record<string,unknown>,ID : string)=>{
    const {name,email,password,phone,role} = payload
    const hashedPassword =await bcrypt.hash(password as string,12);
    const result = await pool.query(`UPDATE users SET name = $1, email = $2, password = $3, phone = $4, role = $5 WHERE id = $6 RETURNING *`, [name,email,hashedPassword,phone,role,ID]);
    return result
}

const deleteUser = async(id : string)=>{
    const result = await pool.query(
      `DELETE FROM users WHERE id = $1 RETURNING *`,
      [id]
    );

    return result
}



export const UserService = {
    getAllUsers,
    updateUser,
    deleteUser
}