import { Router } from "express";
import { ProductRepository } from "../repositories/product.repository";
import { ProductService } from "../services/product.service";
import { ProductController } from "../controllers/product.controller";

const router = Router();

// Dependencies
const productRepository = new ProductRepository();
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

// Routes
router.get("/", productController.findAll);
router.get("/:productId", productController.findById);
router.post("/", productController.create);
router.put("/:productId", productController.update);
router.delete("/:productId", productController.deleteOneById);

export default router;
