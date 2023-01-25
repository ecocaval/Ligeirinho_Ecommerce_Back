//* Libraries
import { Router } from "express";

//* Controllers
import { userLogin } from "../controllers/loginController.js";

//* Middlewares
import { validateSchema } from "../middlewares/SchemaMiddleware.js";

//* Schemas
import { userLoginSchema } from "../schemas/userSchemas.js";

const loginRouter = Router()

loginRouter.post('/login', validateSchema(userLoginSchema), userLogin)

export default loginRouter