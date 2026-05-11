import { Router } from "express";
import { getSettingsController, updateSettingsController } from "../controllers/settings.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";

const router = Router();
router.use(authenticate);
router.get("/", getSettingsController);
router.put("/", authorize(["SUPER_ADMIN", "ADMIN"]), updateSettingsController);

export default router;
