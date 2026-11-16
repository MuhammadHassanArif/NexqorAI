import * as projectService from "../services/projectService.js";

export async function list(req, res) {
  const projects = await projectService.listProjects(req.user.id);
  res.json({ projects });
}

export async function create(req, res) {
  const project = await projectService.createProject(req.user.id, req.body);
  res.status(201).json({ project });
}

export async function getOne(req, res) {
  const project = await projectService.getProject(req.user.id, req.params.id);
  res.json({ project });
}

export async function update(req, res) {
  const project = await projectService.updateProject(req.user.id, req.params.id, req.body);
  res.json({ project });
}

export async function remove(req, res) {
  await projectService.deleteProject(req.user.id, req.params.id);
  res.status(204).end();
}