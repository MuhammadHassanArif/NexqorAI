import mongoose from "mongoose";

export const PROJECT_CATEGORIES = [
  "Product development",
  "Brand strategy",
  "Web application",
  "Data platform",
  "Marketing launch",
  "Health technology",
  "Other",
];

export const PROJECT_STATUSES = ["in_progress", "completed"];

const projectSchema = new mongoose.Schema(
  {
    // The owner. Every query in projectService filters by this, so nobody can see another user's project.
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 60 },
    description: { type: String, trim: true, maxlength: 300, default: "" },
    category: { type: String, enum: PROJECT_CATEGORIES, default: "Other" },
    status: { type: String, enum: PROJECT_STATUSES, default: "in_progress" },
    // Percent of work done. It is 0 until tasks exist (later it will be calculated from the tasks),
    // and 100 when the project is marked as completed.
    progress: { type: Number, min: 0, max: 100, default: 0 },
    dueDate: { type: Date, default: null },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_document, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        delete ret.user;
        return ret;
      },
    },
  },
);

projectSchema.index({ user: 1, updatedAt: -1 });

export const Project = mongoose.model("Project", projectSchema);