import { Router } from "express";

import { getAllTokens } from "../controllers/tokenController.js";

const tokenRouter = Router()

tokenRouter.get("/tokens", getAllTokens)

export default tokenRouter