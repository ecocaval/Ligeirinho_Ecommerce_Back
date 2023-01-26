//* Libraries
import { Router } from "express";

//* Controllers
import { createNewProduct, createNewRestaurant, deleteProductById, getAllProducts, getAllRestaurants, getProductbyId, getRestaurantById } from "../controllers/restaurantController";

//* Middlewares
import { validateToken } from "../middlewares/TokenMiddleWare.js";
import { validateSchema } from "../middlewares/SchemaMiddleware,js";

//* Schemas
import { createNewProductSchema, createNewRestaurantSchema } from "../schemas/restaurantSchemas.js";

const restaurantRouter = Router();

restaurantRouter.get('restaurants', validateToken, getAllRestaurants);

restaurantRouter.get('restaurants:restaurantId', validateToken, getRestaurantById);

restaurantRouter.post('restaurants', validateSchema(createNewRestaurantSchema), createNewRestaurant);

restaurantRouter.get('products', validateToken, getAllProducts);

restaurantRouter.get('products:productId', validateToken, getProductbyId);

restaurantRouter.post('products', validateSchema(createNewProductSchema), createNewProduct);

restaurantRouter.delete('products:productId', deleteProductById)

export default restaurantRouter;