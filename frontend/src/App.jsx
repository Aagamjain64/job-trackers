import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateJob from "./pages/CreateJob";
import Navbar from "./components/navbar";
import ProtectedRoute from "./components/ProtectedRoute";
function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />

  <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    }
  />

  <Route
    path="/create-job"
    element={
      <ProtectedRoute>
        <CreateJob />
      </ProtectedRoute>
    }
  />
</Routes>

    </BrowserRouter>
  );
}

export default App;
