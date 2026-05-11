import { Request, Response, NextFunction } from "express";
import { getDashboardReport } from "../services/report.service";

export async function dashboardReportController(req: Request, res: Response, next: NextFunction) {
  try {
    const report = await getDashboardReport();
    res.json(report);
  } catch (error) {
    next(error);
  }
}
