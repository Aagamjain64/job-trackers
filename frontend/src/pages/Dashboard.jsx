import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { getUser } from "../utils/auth";

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate(); // ← useNavigate here
  const user = getUser(); // token se user niklega

  useEffect(() => {
    const token = localStorage.getItem("token");
    api
      .get("/api/jobs", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setJobs(res.data))
      .catch(err => console.error(err));
  }, []);

  // ← Put these functions inside component
  const handleEdit = (job) => {
    localStorage.setItem("editJob", JSON.stringify(job));
    navigate("/create-job"); // redirect to create job page
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/api/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(jobs.filter(job => job._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">
       {user.name} Job Dashboard
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map(job => (
          <div
            key={job._id}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 p-6 border-t-4 border-indigo-500"
          >
            <h3 className="text-xl font-semibold text-indigo-600">
              {job.role}
            </h3>
            <p className="text-sm text-gray-500 mb-3">{job.company}</p>

            <div className="text-sm text-gray-700 space-y-1">
              <p><b>💰 Salary:</b> {job.salary}</p>
              <p><b>📌 Status:</b> {job.status}</p>
            </div>

            <p className="text-gray-600 text-sm mt-4 line-clamp-3">
              {job.notes}
            </p>

            {/* Edit & Delete buttons */}
            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => handleEdit(job)}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(job._id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
