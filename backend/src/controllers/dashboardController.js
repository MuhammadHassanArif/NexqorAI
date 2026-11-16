import * as dashboardService from "../services/dashboardService.js";

export async function overview(req, res) {
  const data = await dashboardService.getOverview(req.user.id);
  res.json(data);
}