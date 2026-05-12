import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import {
  createLead,
  deleteLead,
  getLead,
  listLeads,
  updateLead,
  assignLead,
  getLeadActivities,
  createLeadActivity,
  getLeadsAnalytics,
  getKanbanData
} from "../services/lead.service";

const leadSchema = z.object({
  fullName: z.string().min(2),
  companyName: z.string().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  leadSource: z.string().optional(),
  status: z.string().optional(),
  priority: z.string().optional(),
  budgetValue: z.number().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
  followUpDate: z.string().optional(),
  nextMeetingDate: z.string().optional(),
  expectedClosingDate: z.string().optional(),
  dealValue: z.number().optional(),
  conversionProbability: z.number().min(0).max(100).optional(),
  lostReason: z.string().optional(),
  lostReasonNotes: z.string().optional(),
});

const assignLeadSchema = z.object({
  assignedSalesPersonId: z.string(),
  notes: z.string().optional(),
});

const leadActivitySchema = z.object({
  action: z.string(),
  description: z.string(),
  oldValue: z.string().optional(),
  newValue: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

const filterSchema = z.object({
  status: z.string().optional(),
  priority: z.string().optional(),
  assignedSalesPersonId: z.string().optional(),
  leadSource: z.string().optional(),
  country: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  progressMin: z.number().optional(),
  progressMax: z.number().optional(),
  conversionMin: z.number().optional(),
  conversionMax: z.number().optional(),
  search: z.string().optional(),
});

export async function createLeadController(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = leadSchema.parse(req.body);
    const lead = await createLead({
      ...payload,
      followUpDate: payload.followUpDate ? new Date(payload.followUpDate) : undefined,
      nextMeetingDate: payload.nextMeetingDate ? new Date(payload.nextMeetingDate) : undefined,
      expectedClosingDate: payload.expectedClosingDate ? new Date(payload.expectedClosingDate) : undefined,
    });

    // Create activity log
    await createLeadActivity(lead.id, req.user!.id, "lead_created", `Lead created by ${req.user!.name}`);

    res.status(201).json(lead);
  } catch (error) {
    next(error);
  }
}

export async function getLeadsController(req: Request, res: Response, next: NextFunction) {
  try {
    const filters = filterSchema.parse(req.query);
    const leads = await listLeads(req.user?.id, filters);
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
      nextMeetingDate: payload.nextMeetingDate ? new Date(payload.nextMeetingDate) : undefined,
      expectedClosingDate: payload.expectedClosingDate ? new Date(payload.expectedClosingDate) : undefined,
    });

    // Log activity
    await createLeadActivity(req.params.id, req.user!.id, "lead_updated", `Lead updated by ${req.user!.name}`);

    res.json(lead);
  } catch (error) {
    next(error);
  }
}

export async function deleteLeadController(req: Request, res: Response, next: NextFunction) {
  try {
    await deleteLead(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function assignLeadController(req: Request, res: Response, next: NextFunction) {
  try {
    const { assignedSalesPersonId, notes } = assignLeadSchema.parse(req.body);
    const lead = await assignLead(req.params.id, assignedSalesPersonId, req.user!.id);

    // Log assignment activity
    await createLeadActivity(
      req.params.id,
      req.user!.id,
      "lead_assigned",
      `Lead assigned to sales person by ${req.user!.name}`,
      undefined,
      assignedSalesPersonId,
      { notes }
    );

    res.json(lead);
  } catch (error) {
    next(error);
  }
}

export async function getLeadActivitiesController(req: Request, res: Response, next: NextFunction) {
  try {
    const activities = await getLeadActivities(req.params.id);
    res.json(activities);
  } catch (error) {
    next(error);
  }
}

export async function createLeadActivityController(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = leadActivitySchema.parse(req.body);
    const activity = await createLeadActivity(
      req.params.id,
      req.user!.id,
      payload.action,
      payload.description,
      payload.oldValue,
      payload.newValue,
      payload.metadata
    );
    res.status(201).json(activity);
  } catch (error) {
    next(error);
  }
}

export async function getLeadsAnalyticsController(req: Request, res: Response, next: NextFunction) {
  try {
    const analytics = await getLeadsAnalytics();
    res.json(analytics);
  } catch (error) {
    next(error);
  }
}

export async function getKanbanDataController(req: Request, res: Response, next: NextFunction) {
  try {
    const kanbanData = await getKanbanData();
    res.json(kanbanData);
  } catch (error) {
    next(error);
  }
}

export async function updateLeadStatusController(req: Request, res: Response, next: NextFunction) {
  try {
    const { status, notes } = z.object({
      status: z.string(),
      notes: z.string().optional()
    }).parse(req.body);

    const lead = await updateLead(req.params.id, { status });

    // Update progress percentage based on status
    const progressMap: Record<string, number> = {
      NEW_LEAD: 10,
      CONTACTED: 20,
      INTERESTED: 30,
      QUALIFIED: 40,
      MEETING_SCHEDULED: 50,
      PROPOSAL_SENT: 60,
      NEGOTIATION: 80,
      FOLLOW_UP: 70,
      WAITING_RESPONSE: 75,
      WON: 100,
      LOST: 0,
    };

    if (progressMap[status]) {
      await updateLead(req.params.id, { leadProgressPercent: progressMap[status] });
    }

    // Log status change activity
    await createLeadActivity(
      req.params.id,
      req.user!.id,
      "status_changed",
      `Status changed to ${status}`,
      undefined,
      status,
      { notes }
    );

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
