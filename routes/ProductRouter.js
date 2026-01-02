import express from 'express';
import { createProduct, deleteProduct, productUpdate, retrieveProductById, retrieveProducts, retrieveProductsByCategory, searchProduct } from '../controllers/ProductController.js';

const productRouter = express.Router();

productRouter.post('/',createProduct);
productRouter.get('/search/:query',searchProduct);
productRouter.get('/',retrieveProducts);
productRouter.get('/:productId',retrieveProductById);
productRouter.put('/:productId',productUpdate);
productRouter.delete('/:productId',deleteProduct);
productRouter.get('/category/:category',retrieveProductsByCategory)


export default productRouter;