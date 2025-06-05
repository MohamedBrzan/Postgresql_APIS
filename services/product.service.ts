import { Product } from "../entities/Product";
import { ProductRepository } from "../repositories/product.repository";

export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async create(product: Product) {
    return await this.productRepository.create(product);
  }

  async update(productId: string, product: Product) {
    return await this.productRepository.update(productId, product);
  }

  async findById(productId: string) {
    return await this.productRepository.findById(productId);
  }

  async findAll() {
    return await this.productRepository.findAll();
  }

  async deleteOneById(productId: string) {
    return this.productRepository.deleteOneById(productId);
  }
}
