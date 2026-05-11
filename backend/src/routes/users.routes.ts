import { Router } from "express";
import {
  deactivateUserController,
  getUserController,
  getUsersController,
  updateUserController,
} from "../controllers/user.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";

const router = Router();
router.use(authenticate);
router.get("/", authorize(["SUPER_ADMIN", "ADMIN"]), getUsersController);
router.get("/:id", getUserController);
router.put("/:id", authorize(["SUPER_ADMIN", "ADMIN"]), updateUserController);
router.delete("/:id", authorize(["SUPER_ADMIN", "ADMIN"]), deactivateUserController);

export default router;
