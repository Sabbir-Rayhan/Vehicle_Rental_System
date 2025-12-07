import config from "../../config";
import { pool } from "../../config/DataBase";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const SigninUser = async (paylod: Record<string, unknown>) => {
  const { email, password } = paylod;

  const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);

  if (result.rows.length === 0) {
    throw new Error("User Not Found...!");
  }

  const user = result.rows[0];

  const match = await bcrypt.compare(password as string, user.password);

  if (!match) {
    throw new Error("Password Not Matched...!");
  }

  const secret = config.jwtsecret;

  const token = jwt.sign(
    {
      id: user.id, 
      name: user.name,
      email: user.email,
      role: user.role,
    },
    secret as string,
    { expiresIn: "1d" }
  );

  //console.log({token});

  return { token, user };
};

const userSignup = async (payload: Record<string, unknown>) => {
  if (!payload) {
    throw new Error("Payload Missing...!");
  }
  const { name, email, password, phone, role } = payload;

  const hashedPassword = await bcrypt.hash(password as string, 12);
  const result = await pool.query(
    `INSERT INTO users(name,email,password,phone,role) VALUES($1,$2,$3,$4,$5) RETURNING *`,
    [name, email, hashedPassword, phone, role]
  );

  return result;
};

export const AuthServices = {
  userSignup,
  SigninUser,
};
