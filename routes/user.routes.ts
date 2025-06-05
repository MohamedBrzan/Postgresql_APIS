import { UserController } from "./../controllers/user.controller";
import { UserService } from "./../services/user.service";
import { UserRepository } from "./../repositories/user.repository";
import { Router } from "express";

const router = Router();

// Dependencies
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

// Routes
router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/email/:email", userController.findByEmail);

router.get("/", userController.getAllUsers);

router.get("/:id", userController.findById);

router.put("/:id", userController.update);

router.post("/reset-password", userController.resetPassword)

router.post("/forgot-password", userController.fogotPassword)

export default router;
