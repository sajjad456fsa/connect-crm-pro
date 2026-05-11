import { Router } from "express";
import {
  createLeadController,
  deleteLeadController,
  getLeadController,
  getLeadsController,
  updateLeadController,
} from "../controllers/lead.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);
router.get("/", getLeadsController);
router.post("/", createLeadController);
router.get("/:id", getLeadController);
router.put("/:id", updateLeadController);
router.delete("/:id", deleteLeadController);

export default router;
