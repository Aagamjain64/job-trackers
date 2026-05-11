import { useState } from "react";
import api from "../api/axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
<<<<<<< HEAD
  const [error, setError] = useState("");

  const submit = async () => {
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      const res = await api.post("/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      window.location.href = "/";
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    }
=======

  const submit = async () => {
    const res = await api.post("/api/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    window.location.href = "/dashboard";
>>>>>>> bfe5b39f72b3d39908224b23c61477278f4bc350
  };

  return (
    <div className="p-10">
      <h2 className="text-2xl mb-4">Login</h2>
      <input className="border p-2 w-full mb-3" placeholder="Email" onChange={e=>setEmail(e.target.value)} />
      <input className="border p-2 w-full mb-3" placeholder="Password" type="password" onChange={e=>setPassword(e.target.value)} />
<<<<<<< HEAD
      {error && <p className="text-red-600 mb-3">{error}</p>}
=======
>>>>>>> bfe5b39f72b3d39908224b23c61477278f4bc350
      <button onClick={submit} className="bg-blue-600 text-white p-2">Login</button>
    </div>
  );
};

export default Login;
