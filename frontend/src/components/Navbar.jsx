import { Link } from "react-router-dom";
import { getUser, logout } from "../utils/auth";

const Navbar = () => {
  const user = getUser(); // token se user niklega

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 flex justify-between items-center shadow-lg">
<<<<<<< HEAD
      <Link to="/" className="text-xl font-bold tracking-wide hover:opacity-90">
        Job Portal
      </Link>
=======
      <h1 className="text-xl font-bold tracking-wide">Job Portal</h1>
>>>>>>> bfe5b39f72b3d39908224b23c61477278f4bc350
    
      <div className="space-x-6 text-sm font-medium flex items-center">
        {user ? (
          <>
            <span className="font-semibold">Hi, {user.name}</span>

<<<<<<< HEAD
            <Link className="hover:text-gray-200" to="/">
=======
            <Link className="hover:text-gray-200" to="/dashboard">
>>>>>>> bfe5b39f72b3d39908224b23c61477278f4bc350
              Dashboard
            </Link>

            <Link className="hover:text-gray-200" to="/create-job">
              Create Job
            </Link>

            <button
              onClick={logout}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link className="hover:text-gray-200" to="/login">
              Login
            </Link>

            <Link
              className="bg-white text-indigo-600 px-3 py-1 rounded hover:bg-gray-200"
              to="/register"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
