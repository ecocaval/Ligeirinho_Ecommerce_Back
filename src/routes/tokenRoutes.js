//* Libraries
import { Router } from "express";

//* Controllers
import { getAllTokens } from "../controllers/tokenController.js";

const tokenRouter = Router()

tokenRouter.get("/tokens", getAllTokens)

export default tokenRouter