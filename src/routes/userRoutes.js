//* Libraries
import { Router } from "express";

//* Controllers
import { createUserToken, deleteTokenByUserId } from "../controllers/tokenController.js";
import { changeUserInfo, createNewUser, deleteUserById, getAllUsers, getUserById } from "../controllers/userController.js";

//* Middlewares
import { validateSchema } from "../middlewares/SchemaMiddleware.js";
import { validateToken } from "../middlewares/TokenMiddleWare.js";

//* Schemas
import { changeUserInfoSchema, createNewUserSchema } from "../schemas/userSchemas.js";

const userRouter = Router();

userRouter.get("/users", getAllUsers)

userRouter.get("/users/:userId", validateToken, getUserById)

userRouter.post("/users", validateSchema(createNewUserSchema), createNewUser, createUserToken)

userRouter.put("/users/:userId", validateToken, validateSchema(changeUserInfoSchema), changeUserInfo)

userRouter.delete("/users/:userId", validateToken, deleteUserById, deleteTokenByUserId) 

export default userRouter


