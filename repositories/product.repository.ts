import { db } from "../config/db";
import { Product } from "../entities/Product";
import { IProductRepository } from "../interfaces/IProductRepository";

export class ProductRepository implements IProductRepository {
  async create(product: Product): Promise<Product> {
    const { name, description, price, stock } = product;
    const query = `
        INSERT INTO products (name, description, price, stock)
        VALUES($1, $2, $3, $4)
        RETURNING *
        `;
    const values = [name, description, price, stock];
    return (await db.query(query, values)).rows[0];
  }

  async update(productId: string, product: Partial<Product>): Promise<Product> {
    const { name, description, price, stock } = product;
    const query = `
        UPDATE products
        SET name = $1, description = $2, price = $3, stock = $4
        WHERE id = $5
        RETURNING *
        `;
    const values = [name, description, price, stock, productId];
    return (await db.query(query, values)).rows[0];
  }

  async findAll(): Promise<Product[]> {
    const query = "SELECT * FROM products";
    return (await db.query(query)).rows;
  }

  async findById(productId: string): Promise<Product> {
    const query = `
        SELECT * FROM products
        WHERE id = $1 LIMIT 1;
        `;
    return (await db.query(query, [productId])).rows[0];
  }

  async deleteOneById(productId: string): Promise<unknown> {
    const query = `
        DELETE FROM products
        WHERE id = $1
        `;
    return (await db.query(query, [productId])).rows[0];
  }
}
