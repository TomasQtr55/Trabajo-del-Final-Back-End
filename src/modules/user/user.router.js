import { Router } from "express";
import { userController } from "./user.controller.js";
import { validate } from "../../middlewares/validator.middleware.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import { loginUser } from "./schema/loginUser.schema.js";
import { createUserSchema } from "./schema/user.shema.js";

const userRouter = Router();

userRouter.post('/register', validate(createUserSchema), userController.register);
userRouter.post('/login', validate(loginUser), userController.login)
userRouter.get('/users',authMiddleware, userController.findAll)

export default userRouter;