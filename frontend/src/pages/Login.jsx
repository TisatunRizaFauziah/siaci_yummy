/* eslint-disable no-unused-vars */
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { KrjContext } from "../App";
import { useContext, useState } from "react";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUserRole } = useContext(KrjContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password, role }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const expireDate = new Date();
        expireDate.setHours(expireDate.getHours() + 1);

        Cookies.set("token", data.token, { expires: expireDate });
        setUserRole(role);
        Cookies.set("role", role, { expires: expireDate });

        if (role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        setError(
          "Login failed. Please check your username, password, and role."
        );
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  const pindah = (url) => (location.href = url);
  if (Cookies.get("token")) {
    if (Cookies.get("role").toLowerCase() === "admin") pindah("/admin");
    else pindah("/");
  } else
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-r from-blue-200 via-blue-400 to-pink">
        <div className="border relative bg-white p-8 rounded-lg shadow-xl w-full max-w-md transition-transform transform hover:scale-105 duration-500 ease-in-out hover:shadow-blue-600/50 hover:shadow-[0px_4px_10px_rgba(0,0,0,0.2),_0px_10px_20px_rgba(0,0,0,0.1)]">
          <h1 className="text-3xl font-extrabold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-600">
            Login
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4 relative group">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-100 transition duration-300 text-gray-700 bg-white"
              />
              <label className="absolute left-4 top-0 transform -translate-y-1/2 text-blue-600 transition-all pointer-events-none group-focus-within:text-blue-500">
                Username
              </label>
            </div>
            <div className="mb-4 relative group">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-100 transition duration-300 text-gray-700 bg-white"
              />
              <label className="absolute left-4 top-0 transform -translate-y-1/2 text-blue-600 transition-all pointer-events-none group-focus-within:text-blue-500">
                Password
              </label>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Role</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value="user"
                    checked={role === "user"}
                    onChange={(e) => setRole(e.target.value)}
                    className="mr-2"
                  />
                  User
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={role === "admin"}
                    onChange={(e) => setRole(e.target.value)}
                    className="mr-2"
                  />
                  Admin
                </label>
              </div>
            </div>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <p className="text-sm mb-4 text-center text-gray-500">
              Forgot password?{" "}
              <Link
                to="/forgot-password"
                className="text-blue-600 hover:underline"
              >
                Click Here
              </Link>
            </p>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white py-2 rounded-md hover:bg-gradient-to-r hover:from-blue-500 hover:to-green-400 transition duration-300 shadow-lg"
            >
              Login
            </button>
            <p className="text-sm mt-4 text-center text-gray-500">
              Create an Account{" "}
              <Link to="/register" className="text-blue-600 hover:underline">
                Click Here
              </Link>
            </p>
          </form>
        </div>
      </div>
    );
}

export default Login;
