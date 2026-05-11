const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    company: { type: String, required: true },
    role: { type: String, required: true },
    location: { type: String },
    salary: { type: Number, required: true },
    experience: { type: String },
    status: {
      type: String,
      enum: ["Applied", "Interview", "Offer", "Rejected"],
      default: "Applied",
    },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("JobApplication", jobSchema);
