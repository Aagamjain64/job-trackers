    const express = require("express");
    const dotenv = require("dotenv");
    const connectDB = require("./config/db");
    const authRoutes = require("./routes/auth.routes");
    const jobRoutes = require("./routes/job.routes");
    const cors = require('cors');
    dotenv.config();
    connectDB();

    const app = express();
    app.use(express.json());

app.use(cors({
  origin: ["http://localhost:5173","https://job-trackerss.netlify.app/"], // frontend
  credentials: true
}));
    // Routes
    app.use("/api/auth", authRoutes);
    app.use("/api/jobs", jobRoutes);

    // Test
    app.get("/", (req, res) => res.send("API is running 🚀"));

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
