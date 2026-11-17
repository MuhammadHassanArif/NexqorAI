import * as aiService from "../services/aiService.js";

export async function generate(req, res) {
  const result = await aiService.generate(req.user.id, req.body);
  res.status(201).json(result);
}