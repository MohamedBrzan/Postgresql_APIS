export class Product {
  public readonly id?: string;
  public name: string;
  public description: string;
  public price: number;
  public stock: number;
  public readonly created_at?: Date;
  public readonly updated_at?: Date;

  constructor(params: {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    readonly created_at?: Date;
    readonly updated_at?: Date;
  }) {
    const { id, name, description, price, stock, created_at, updated_at } =
      params;
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.stock = stock;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}
