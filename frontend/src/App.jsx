import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
<<<<<<< HEAD
import Home from "./pages/Home";
=======
import Dashboard from "./pages/Dashboard";
>>>>>>> bfe5b39f72b3d39908224b23c61477278f4bc350
import CreateJob from "./pages/CreateJob";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
<<<<<<< HEAD
  <Route path="/" element={<Home />} />
=======
>>>>>>> bfe5b39f72b3d39908224b23c61477278f4bc350
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />

  <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
<<<<<<< HEAD
        <Home />
=======
        <Dashboard />
>>>>>>> bfe5b39f72b3d39908224b23c61477278f4bc350
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
