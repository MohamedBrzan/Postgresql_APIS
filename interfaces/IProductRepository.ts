import { Product } from "../entities/Product";

export interface IProductRepository {
  create(product: Product): Promise<Product>;
  update(productId: string, product: Product): Promise<Product>;
  findById(productId: string): Promise<Product>;
  findAll(): Promise<Product[]>;
  deleteOneById(productId: string): Promise<unknown>;
}
