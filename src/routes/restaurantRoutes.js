//* Libraries
import { Router } from "express";

//* Controllers
import {
    createNewProduct, createNewRestaurant, deleteProductById,
    getAllProducts, getAllRestaurantProducts, getAllRestaurants,
    getProductbyId, getRestaurantById, linkProductToRestaurant
} from "../controllers/restaurantController.js";

//* Middlewares
import { validateToken } from "../middlewares/TokenMiddleWare.js";
import { validateSchema } from "../middlewares/SchemaMiddleware.js";

//* Schemas
import { createNewProductSchema, createNewRestaurantSchema } from "../schemas/restaurantSchemas.js";

const restaurantRouter = Router();

restaurantRouter.get('/restaurants', validateToken, getAllRestaurants); 

restaurantRouter.get('/restaurants/:restaurantId', validateToken, getRestaurantById); 

restaurantRouter.post('/restaurants', validateSchema(createNewRestaurantSchema), createNewRestaurant); 

restaurantRouter.get('/products', validateToken, getAllProducts); 

restaurantRouter.get('/restaurants/:restaurantId/products', validateToken, getAllRestaurantProducts); 

restaurantRouter.get('/restaurants/:restaurantId/products/:productId', validateToken, getProductbyId); 

restaurantRouter.post('/restaurants/:restaurantId/products', validateSchema(createNewProductSchema), createNewProduct, linkProductToRestaurant); 

restaurantRouter.delete('/restaurants/:restaurantId/products/:productId', deleteProductById); 

export default restaurantRouter;