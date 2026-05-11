import { Router } from "express";
import authRoutes from "./auth.routes";
import leadRoutes from "./leads.routes";
import customerRoutes from "./customers.routes";
import taskRoutes from "./tasks.routes";
import userRoutes from "./users.routes";
import reportRoutes from "./reports.routes";
import settingsRoutes from "./settings.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/leads", leadRoutes);
router.use("/customers", customerRoutes);
router.use("/tasks", taskRoutes);
router.use("/users", userRoutes);
router.use("/reports", reportRoutes);
router.use("/settings", settingsRoutes);

export default router;
