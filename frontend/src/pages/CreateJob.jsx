import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const CreateJob = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    companyName: "",
    role: "",
    location: "",
    salary: "",
    status: "",
    experience: "",
    description: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [jobId, setJobId] = useState(null);

  // Load job data if editing
  useEffect(() => {
    const jobData = localStorage.getItem("editJob");
    if (jobData) {
      const job = JSON.parse(jobData);
      setForm({
        companyName: job.companyName,
        role: job.role,
        location: job.location,
        salary: job.salary,
        status: job.status,
        experience: job.experience,
        description: job.description,
      });
      setEditMode(true);
      setJobId(job._id);
      localStorage.removeItem("editJob"); // Clear after loading
    }
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
  const token = localStorage.getItem("token");

  const payload = {
    company: form.companyName,       // map to backend
    role: form.role,
    salary: Number(form.salary),     // convert to number
    status: form.status || "Applied",
    notes: form.description          // map to backend
  };

  try {
    if (editMode) {
      await api.put(`/api/jobs/${jobId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      await api.post("/api/jobs", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }

    navigate("/dashboard");
  } catch (err) {
    console.error("ERROR:", err.response?.data || err.message);
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {editMode ? "Edit Job" : "Create New Job"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="companyName" placeholder="Company Name" className="input" onChange={handleChange} value={form.companyName} />
          <input name="role" placeholder="Job Role" className="input" onChange={handleChange} value={form.role} />
          <input name="location" placeholder="Location" className="input" onChange={handleChange} value={form.location} />
          <input name="salary" placeholder="Salary" className="input" onChange={handleChange} value={form.salary} />
          <input name="experience" placeholder="Experience" className="input" onChange={handleChange} value={form.experience} />
          <input name="status" placeholder="Status (Open/Closed)" className="input" onChange={handleChange} value={form.status} />
        </div>

        <textarea
          name="description"
          placeholder="Job Description"
          className="input mt-4 h-28 resize-none"
          onChange={handleChange}
          value={form.description}
        />

        <button
          onClick={submit}
          className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition"
        >
          {editMode ? "Update Job" : "Save Job"}
        </button>
      </div>
    </div>
  );
};

export default CreateJob;
