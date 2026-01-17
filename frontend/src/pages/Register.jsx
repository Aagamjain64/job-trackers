import { useState } from "react";
import api from "../api/axios";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async () => {
    await api.post("/api/auth/register", { name, email, password });
    window.location.href = "/login";
  };

  return (
    <div className="p-10">
      <h2 className="text-2xl mb-4">Register</h2>
      <input className="border p-2 w-full mb-3" placeholder="Name" onChange={e=>setName(e.target.value)} />
      <input className="border p-2 w-full mb-3" placeholder="Email" onChange={e=>setEmail(e.target.value)} />
      <input className="border p-2 w-full mb-3" placeholder="Password" type="password" onChange={e=>setPassword(e.target.value)} />
      <button onClick={submit} className="bg-green-600 text-white p-2">Register</button>
    </div>
  );
};

export default Register;
