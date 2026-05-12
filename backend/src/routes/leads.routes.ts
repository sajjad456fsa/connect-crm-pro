import { Router } from "express";
import {
  createLeadController,
  deleteLeadController,
  getLeadController,
  getLeadsController,
  updateLeadController,
  assignLeadController,
  getLeadActivitiesController,
  createLeadActivityController,
  getLeadsAnalyticsController,
  getKanbanDataController,
  updateLeadStatusController,
} from "../controllers/lead.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

// Lead CRUD operations
router.get("/", getLeadsController);
router.post("/", createLeadController);
router.get("/:id", getLeadController);
router.put("/:id", updateLeadController);
router.delete("/:id", deleteLeadController);

// Lead assignment
router.post("/:id/assign", assignLeadController);

// Lead status updates
router.patch("/:id/status", updateLeadStatusController);

// Lead activities
router.get("/:id/activities", getLeadActivitiesController);
router.post("/:id/activities", createLeadActivityController);

// Analytics and reporting
router.get("/analytics/overview", getLeadsAnalyticsController);
router.get("/kanban/data", getKanbanDataController);

export default router;
