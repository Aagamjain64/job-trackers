const express = require("express");
const router = express.Router();
const JobApplication = require("../models/JobApplication");
const authMiddleware = require("../middleware/auth.middleware");

// Create job
router.post("/", authMiddleware, async (req, res) => {
  try {
    const job = await JobApplication.create({
      user: req.userId,
      ...req.body
    });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all jobs for user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const jobs = await JobApplication.find({ user: req.userId });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update job
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const job = await JobApplication.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true }
    );
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete job
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const job = await JobApplication.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json({ message: "Job deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
