import { Router } from "express";
import { dashboardReportController } from "../controllers/report.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();
router.use(authenticate);
router.get("/dashboard", dashboardReportController);

export default router;
