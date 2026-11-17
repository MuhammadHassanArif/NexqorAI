import mongoose from "mongoose";

// The text modules that exist. The keys of MODULE_PROMPTS (services/ai/prompts.js) must match this list.
export const GENERATION_MODULES = [
  "business-analyst",
  "project-manager",
  "code-generator",
  "code-analyzer",
  "documentation",
];

// One document = one AI request (PDF: aiGenerations collection)
const generationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    // Optional: the project this result was saved against
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", default: null },
    module: { type: String, enum: GENERATION_MODULES, required: true },
    prompt: { type: String, required: true, maxlength: 10000 },
    output: { type: String, default: "" },
    // pending: waiting for the AI. A pending or completed generation counts as used.
    status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
    errorMessage: { type: String, maxlength: 300 },
    provider: { type: String, maxlength: 40 },
    model: { type: String, maxlength: 80 },
    durationMs: { type: Number },
    favorite: { type: Boolean, default: false },
    // "Deleting" from the history only hides the item. It must still count in the monthly usage,
    // otherwise a user could delete results to get unlimited generations.
    isHidden: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      // What the frontend receives. Internal details (provider, model, errors) stay on the server.
      transform(_document, ret) {
        ret.id = ret._id.toString();
        ret.project = ret.project ? ret.project.toString() : null;
        delete ret._id;
        delete ret.__v;
        delete ret.user;
        delete ret.provider;
        delete ret.model;
        delete ret.errorMessage;
        delete ret.isHidden;
        return ret;
      },
    },
  },
);

generationSchema.index({ user: 1, createdAt: -1 });
generationSchema.index({ user: 1, status: 1, createdAt: -1 });

export const Generation = mongoose.model("Generation", generationSchema);