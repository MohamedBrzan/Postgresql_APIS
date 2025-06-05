import { RequestHandler } from "express";
import { Product } from "../entities/Product";
import { ProductService } from "../services/product.service";

export class ProductController {
  constructor(private readonly productService: ProductService) {}

  create: RequestHandler = async (req, res) => {
    try {
      const product = await this.productService.create(req.body);
      res
        .status(201)
        .json({ message: "Product Created Successfully.", product });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  update: RequestHandler = async (req, res) => {
    try {
      const product = await this.productService.update(
        req.params.productId,
        req.body
      );
      if (!product)
        res.status(404).json({
          message: `There's no product with this id ${req.params.productId}`,
        });
      else
        res
          .status(200)
          .json({ message: "Product Updated Successfully.", product });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  findById: RequestHandler = async (req, res) => {
    try {
      const product = await this.productService.findById(req.params.productId);
      if (!product)
        res.status(404).json({
          message: `There's no product with this id ${req.params.productId}`,
        });
      else
        res
          .status(200)
          .json({ message: "Product Updated Successfully.", product });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  findAll: RequestHandler = async (req, res) => {
    try {
      const products = await this.productService.findAll();
      res.status(200).json({ products });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  deleteOneById: RequestHandler = async (req, res) => {
    try {
      await this.productService
        .deleteOneById(req.params.productId)
        .then((_res) =>
          res
            .status(200)
            .json({ message: "Product Deleted Successfully.", results: _res })
        )
        .catch((_err) => res.status(500).json({ error: _err }));
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}
