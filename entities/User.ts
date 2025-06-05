/**
 * Represents a User entity in the system.
 * Encapsulates user properties and behaviors.
 */
export class User {
  public readonly id?: number;
  public name: string;
  public email: string;
  public password: string;
  public phone?: string | null;
  public readonly created_at?: Date;
  public readonly updated_at?: Date;

  /**
   * Create a new User instance.
   * @param params - User properties
   */
  constructor(params: {
    id?: number;
    name: string;
    email: string;
    password: string;
    phone?: string | null;
    created_at?: Date;
    updated_at?: Date;
  }) {
    this.id = params.id;
    this.name = params.name;
    this.email = params.email;
    this.password = params.password;
    this.phone = params.phone ?? null;
    this.created_at = params.created_at;
    this.updated_at = params.updated_at;
  }

  /**
   * Returns a JSON-safe representation of the user,
   * omitting sensitive data like password.
   */
  toJSON() {
    const { password, ...safeUser } = this;
    return safeUser;
  }

  /**
   * Factory method to create a User instance from a plain object,
   * e.g., from database query result.
   * @param obj Plain object with user properties
   */
  static fromDBObject(obj: Partial<User>): User {
    if (!obj.password || !obj.password.startsWith("$argon2")) {
      throw new Error("Invalid hash from database");
    }

    return new User({
      id: obj.id,
      name: obj.name ?? "",
      email: obj.email ?? "",
      password: obj.password,
      phone: obj.phone ?? null,
      created_at: obj.created_at ? new Date(obj.created_at) : undefined,
      updated_at: obj.updated_at ? new Date(obj.updated_at) : undefined,
    });
  }
}
