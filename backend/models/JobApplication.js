const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    company: { type: String, required: true },
    role: { type: String, required: true },
<<<<<<< HEAD
    location: { type: String },
    salary: { type: Number, required: true },
    experience: { type: String },
=======
    salary: { type: Number, required: true },
>>>>>>> bfe5b39f72b3d39908224b23c61477278f4bc350
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
