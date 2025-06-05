import { RequestHandler } from "express";
import { UserService } from "../services/user.service";

export class UserController {
  constructor(private readonly userService: UserService) {}

  register: RequestHandler = async (req, res) => {
    try {
      const newUser = await this.userService.register(req.body);
      res.status(201).json({ user: newUser });
    } catch (err: any) {
      if (err.message === "EMAIL_EXISTS") {
        res.status(409).json({ error: "Email already in use" });
      }

      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  login: RequestHandler = async (req, res) => {
    try {
      const { user, token } = await this.userService.login(
        req.body.email,
        req.body.password
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600000, // 1 hour
        sameSite: "strict",
      });

      res.status(200).json({
        message: "Login successful",
        user: user.toJSON(),
      });
    } catch (err) {
      res.status(401).json({ error: "Invalid credentials: " + err });
    }
  };

  findByEmail: RequestHandler = async (req, res) => {
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
  };

  findById: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await this.userService.findById(id);
      res.status(200).json({ user });
    } catch (error: any) {
      const message = error.message || "Internal Server Error";
      const status =
        message === "INVALID_ID" || message === "USER_NOT_FOUND" ? 404 : 500;
      res.status(status).json({ error: message });
    }
  };

  update: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const updatedUser = await this.userService.update(id, updates);
      res.status(200).json({ message: "User updated", user: updatedUser });
    } catch (error: any) {
      const message = error.message || "Internal Server Error";
      const status =
        message === "INVALID_ID" || message === "USER_NOT_FOUND" ? 404 : 500;
      res.status(status).json({ error: message });
    }
  };

  getAllUsers: RequestHandler = async (_req, res) => {
    try {
      const users = await this.userService.getAllUsers();
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
}
