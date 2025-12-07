import { Router } from "express";
import { UserController } from "./user.controller";
import Authenticate from "../../Middleware/Authintication_Middleware";

const router =  Router()


router.get('/users', Authenticate("admin"), UserController.getAllUsers);

router.put('/users/:userId', Authenticate("admin", "customer"), UserController.updateUser);

router.delete('/users/:userId', Authenticate("admin"), UserController.deleteUser);



export const UserRouter = router