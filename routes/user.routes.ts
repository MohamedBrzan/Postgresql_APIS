import { UserController } from "./../controllers/user.controller";
import { UserService } from "./../services/user.service";
import { UserRepository } from "./../repositories/user.repository";
import { Router, RequestHandler } from "express";

const router = Router();

// Dependencies
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

// Routes
router.post(
  "/register",
  userController.register.bind(userController) as unknown as RequestHandler
);
router.post(
  "/login",
  userController.login.bind(userController) as unknown as RequestHandler
);
router.get(
  "/email/:email",
  userController.findByEmail.bind(userController) as unknown as RequestHandler
);

router.get(
  "/",
  userController.getAllUsers.bind(userController) as unknown as RequestHandler
);

router.get(
  "/:id",
  userController.findById.bind(userController) as unknown as RequestHandler
);

router.put(
  "/:id",
  userController.update.bind(userController) as unknown as RequestHandler
);

export default router;
