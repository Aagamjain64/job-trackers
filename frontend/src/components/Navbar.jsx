import { Link } from "react-router-dom";
import { getUser, logout } from "../utils/auth";

const Navbar = () => {
  const user = getUser(); // token se user niklega

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 flex justify-between items-center shadow-lg">
      <h1 className="text-xl font-bold tracking-wide">Job Portal</h1>

      <div className="space-x-6 text-sm font-medium flex items-center">
        {user ? (
          <>
            <span className="font-semibold">Hi, {user.name}</span>

            <Link className="hover:text-gray-200" to="/dashboard">
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
