import * as generationService from "../services/generationService.js";

export async function list(req, res) {
  const generations = await generationService.listGenerations(req.user.id, {
    favorite: req.query.favorite === "true",
    module: typeof req.query.module === "string" ? req.query.module : undefined,
  });
  res.json({ generations });
}

export async function getOne(req, res) {
  const generation = await generationService.getGeneration(req.user.id, req.params.id);
  res.json({ generation });
}

export async function update(req, res) {
  const generation = await generationService.updateGeneration(req.user.id, req.params.id, req.body);
  res.json({ generation });
}

export async function remove(req, res) {
  await generationService.deleteGeneration(req.user.id, req.params.id);
  res.status(204).end();
}