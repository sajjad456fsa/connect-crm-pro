import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { createLead, deleteLead, getLead, listLeads, updateLead } from "../services/lead.service";

const leadSchema = z.object({
  fullName: z.string().min(2),
  company: z.string().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  source: z.string().optional(),
  status: z.string().optional(),
  priority: z.string().optional(),
  budget: z.number().optional(),
  notes: z.string().optional(),
  assignedStaffId: z.string().optional(),
  followUpDate: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export async function createLeadController(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = leadSchema.parse(req.body);
    const lead = await createLead({
      ...payload,
      followUpDate: payload.followUpDate ? new Date(payload.followUpDate) : undefined,
    });
    res.status(201).json(lead);
  } catch (error) {
    next(error);
  }
}

export async function getLeadsController(req: Request, res: Response, next: NextFunction) {
  try {
    const leads = await listLeads(req.user?.id);
    res.json(leads);
  } catch (error) {
    next(error);
  }
}

export async function getLeadController(req: Request, res: Response, next: NextFunction) {
  try {
    const lead = await getLead(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }
    res.json(lead);
  } catch (error) {
    next(error);
  }
}

export async function updateLeadController(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = leadSchema.partial().parse(req.body);
    const lead = await updateLead(req.params.id, {
      ...payload,
      followUpDate: payload.followUpDate ? new Date(payload.followUpDate) : undefined,
    });
    res.json(lead);
  } catch (error) {
    next(error);
  }
}

export async function deleteLeadController(req: Request, res: Response, next: NextFunction) {
  try {
    await deleteLead(req.params.id);
    res.json({ message: "Lead deleted" });
  } catch (error) {
    next(error);
  }
}
