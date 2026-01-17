import { useState } from "react";
import api from "../api/axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async () => {
    const res = await api.post("/api/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    window.location.href = "/dashboard";
  };

  return (
    <div className="p-10">
      <h2 className="text-2xl mb-4">Login</h2>
      <input className="border p-2 w-full mb-3" placeholder="Email" onChange={e=>setEmail(e.target.value)} />
      <input className="border p-2 w-full mb-3" placeholder="Password" type="password" onChange={e=>setPassword(e.target.value)} />
      <button onClick={submit} className="bg-blue-600 text-white p-2">Login</button>
    </div>
  );
};

export default Login;
