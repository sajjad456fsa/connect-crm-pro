import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { createCustomer, deleteCustomer, getCustomer, listCustomers, updateCustomer } from "../services/customer.service";

const customerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  billingInfo: z.string().optional(),
  company: z.string().optional(),
  projectHistory: z.string().optional(),
});

export async function createCustomerController(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = customerSchema.parse(req.body);
    const customer = await createCustomer(payload);
    res.status(201).json(customer);
  } catch (error) {
    next(error);
  }
}

export async function getCustomersController(req: Request, res: Response, next: NextFunction) {
  try {
    const customers = await listCustomers();
    res.json(customers);
  } catch (error) {
    next(error);
  }
}

export async function getCustomerController(req: Request, res: Response, next: NextFunction) {
  try {
    const customer = await getCustomer(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json(customer);
  } catch (error) {
    next(error);
  }
}

export async function updateCustomerController(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = customerSchema.partial().parse(req.body);
    const customer = await updateCustomer(req.params.id, payload);
    res.json(customer);
  } catch (error) {
    next(error);
  }
}

export async function deleteCustomerController(req: Request, res: Response, next: NextFunction) {
  try {
    await deleteCustomer(req.params.id);
    res.json({ message: "Customer deleted" });
  } catch (error) {
    next(error);
  }
}
