import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, role }),
      });

      if (response.ok) {
        setMessage("Registration successful! You can now log in.");
        setError("");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-300">
      <div className="relative bg-white p-8 rounded-lg shadow-xl w-full max-w-md transition-transform transform hover:scale-105 duration-500 ease-in-out hover:shadow-blue-600/50 hover:shadow-[0px_4px_10px_rgba(0,0,0,0.2),_0px_10px_20px_rgba(0,0,0,0.1)]">
        <h1 className="text-3xl font-extrabold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-600">
          Register
        </h1>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {message && <p className="text-green-500 text-sm mb-4">{message}</p>}
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
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white py-2 rounded-md hover:bg-gradient-to-r hover:from-blue-500 hover:to-green-400 transition duration-300 shadow-lg"
          >
            Register
          </button>
          <p className="text-sm mt-4 text-center text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login Here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
