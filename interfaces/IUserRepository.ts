// src/interfaces/IUserRepository.ts

import { User } from "../entities/User";

export interface IUserRepository {
  /**
   * Insert a new user into the database.
   * @param user User entity with all required fields (including hashed password)
   * @returns Created user entity (with generated ID, timestamps, etc)
   */
  register(user: User): Promise<User>;

  /**
   * Retrieve a user by email.
   * @param email User's unique email
   * @returns User entity if found, or null
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Retrieve all users.
   * @returns Array of user entities
   */
  findAll(): Promise<User[]>;

  /**
   * Optional: A login method in the repository would typically fetch user by email.
   * Password verification and token generation should be in the service layer.
   *
   * If you want to keep this method, define it as fetching user by email only.
   * Otherwise, omit this from the interface.
   */
  login?(email: string): Promise<User | null>;
}
