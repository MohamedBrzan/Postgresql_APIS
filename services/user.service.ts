import { User } from "../entities/User";
import argon2 from "argon2";
import jwt, { SignOptions } from "jsonwebtoken";
import type { Secret } from "jsonwebtoken";
import { UserRepository } from "../repositories/user.repository";

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  private async hashPassword(password: string): Promise<string> {
    return await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 5,
      parallelism: 2,
    });
  }

  private async verifyPassword(hash: string, plain: string): Promise<boolean> {
    return await argon2.verify(hash, plain);
  }
  private generateToken(user: User): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const expiresIn = 24 * 60 * 60 * 1000;

    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    const signOptions: SignOptions = {
      expiresIn: Number(expiresIn),
    };

    // Assert secret type to Secret (string works here)
    const jwtSecret: Secret = secret;

    return jwt.sign(payload, jwtSecret, signOptions);
  }

  async register(user: User): Promise<User> {
    // Check if user with this email already exists
    const emailExists = await this.userRepository.findByEmail(user.email);
    if (emailExists) {
      throw new Error("EMAIL_EXISTS"); // You might want a custom error class here
    }

    // Hash the plain text password securely
    const hashedPassword = await this.hashPassword(user.password);

    // Create a new user object with the hashed password
    const userToCreate = new User({
      ...user,
      password: hashedPassword,
    });

    // Save user to DB via repository
    const createdUser = await this.userRepository.register(userToCreate);

    return createdUser;
  }

  async login(
    email: string,
    password: string
  ): Promise<{ user: User; token: string }> {
    const user = await this.userRepository.login(email);
    if (!user) throw new Error("INVALID_CREDENTIALS");
    const valid = await this.verifyPassword(user.password, password);
    if (!valid) throw new Error("INVALID_CREDENTIALS");
    const token = this.generateToken(user);
    return { user, token };
  }

  async findByEmail(email: string): Promise<User> {
    if (!email || typeof email !== "string" || !email.includes("@")) {
      throw new Error("INVALID_EMAIL");
    }

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }

    return user;
  }

  async findById(id: string): Promise<User> {
    if (!id || typeof id !== "string") {
      throw new Error("INVALID_ID");
    }

    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }

    return user;
  }

  async update(id: string, updates: Partial<User>): Promise<User> {
    if (!id || typeof id !== "string") {
      throw new Error("INVALID_ID");
    }

    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new Error("USER_NOT_FOUND");
    }

    const updatedUser = await this.userRepository.update(id, {
      ...existingUser,
      ...updates,
    });

    if (!updatedUser) {
      throw new Error("UPDATE_FAILED");
    }

    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    const users = await this.userRepository.findAll();
    return users;
  }

  async forgotPassword(email: string): Promise<unknown> {
    return await this.userRepository.forgotPassword(email);
  }

  async resetPassword(email: string, newPassword: string): Promise<unknown> {
    const hashedPassword = await this.hashPassword(newPassword);
    return await this.userRepository.resetPassword(email, hashedPassword);
  }
}
