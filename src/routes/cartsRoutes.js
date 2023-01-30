    //* Libraries
import { Router } from "express";

//* Controllers
import { createNewCart, deleteCart, getAllCarts, getUserCart, insertProduct } from "../controllers/cartController.js";

//* Schemas
import { validateSchema } from "../middlewares/SchemaMiddleware.js";
import { insertProductsSchema } from "../schemas/productsSchemas.js";

//* Middlewares
import { validateToken } from "../middlewares/TokenMiddleWare.js";

const cartRouter = Router()

cartRouter.get("/carts", getAllCarts)

cartRouter.get("/carts/:userId", validateToken, getUserCart)

cartRouter.post("/carts/:userId", validateToken, createNewCart)

cartRouter.put("/carts/:userId", validateToken, validateSchema(insertProductsSchema), insertProduct)

cartRouter.delete("/carts/:userId", validateToken, deleteCart)

export default cartRouter