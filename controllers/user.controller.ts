import { Request, Response } from "express";
import { UserService } from "../services/user.service";

export class UserController {
  constructor(private readonly userService: UserService) {}

  async register(req: Request, res: Response) {
    try {
      const newUser = await this.userService.register(req.body);
      return res.status(201).json({ user: newUser });
    } catch (err: any) {
      if (err.message === "EMAIL_EXISTS") {
        return res.status(409).json({ error: "Email already in use" });
      }

      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { user, token } = await this.userService.login(
        req.body.email,
        req.body.password
      );

      // Set token as HttpOnly cookie (secure: true for HTTPS)
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600000, // 1 hour in ms
        sameSite: "strict",
      });

      res.status(200).json({
        message: "Login successful",
        user: user.toJSON(),
      });
    } catch (err) {
      res.status(401).json({ error: "Invalid credentials: " + err });
    }
  }

  async findByEmail(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.params;

      const user = await this.userService.findByEmail(email);

      res.status(200).json({ user });
    } catch (error: any) {
      const message = error.message || "Internal server error";
      const status =
        message === "USER_NOT_FOUND" || message === "INVALID_EMAIL" ? 404 : 500;
      res.status(status).json({ error: message });
    }
  }
  async getAllUsers(_req: Request, res: Response) {
    try {
      const users = await this.userService.getAllUsers();
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
