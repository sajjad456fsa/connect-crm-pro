import { Router } from "express";
import {
  createCustomerController,
  deleteCustomerController,
  getCustomerController,
  getCustomersController,
  updateCustomerController,
} from "../controllers/customer.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);
router.get("/", getCustomersController);
router.post("/", createCustomerController);
router.get("/:id", getCustomerController);
router.put("/:id", updateCustomerController);
router.delete("/:id", deleteCustomerController);

export default router;
