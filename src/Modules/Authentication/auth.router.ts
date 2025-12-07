import { Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router();

router.post('/signin',AuthController.SigninUser)

router.post('/signup',AuthController.CreateUser)

export const AuthRouter = router

