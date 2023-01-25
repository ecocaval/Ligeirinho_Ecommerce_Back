//* Libraries
import { Router } from "express";

//* Controllers
import { createUserToken, deleteTokenByUserId } from "../controllers/tokenController.js";
import { changeUserInfo, createNewUser, deleteUserById, getAllUsers, getUserById } from "../controllers/userController.js";

//* Middlewares
import { validateSchema } from "../middlewares/SchemaMiddleware.js";

//* Schemas
import { changeUserInfoSchema, createNewUserSchema } from "../schemas/userSchemas.js";

const userRouter = Router();

userRouter.get("/users", getAllUsers)

userRouter.get("/users/:userId", getUserById) //! Must have validateToken after

userRouter.post("/users", validateSchema(createNewUserSchema), createNewUser, createUserToken)

userRouter.put("/users/:userId", validateSchema(changeUserInfoSchema), changeUserInfo) //! Must have validateToken after

userRouter.delete("/users/:userId", deleteUserById, deleteTokenByUserId) //! Must have validateToken after

export default userRouter


