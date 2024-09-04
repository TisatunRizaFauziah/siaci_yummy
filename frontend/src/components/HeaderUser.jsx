import {
  LogIn,
  House,
  Info,
  LogOut,
  ShoppingCart,
  ShoppingBasket,
  History,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { KrjContext } from "../App";
import { useContext } from "react";
import Cookies from "js-cookie";

export default function HeaderUser() {
  const { keranjang, historyCount, productCount, userRole, setUserRole } =
    useContext(KrjContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove token and clear user role on logout
    Cookies.remove("token");
    setUserRole(null); // or "user" if you want to reset to a default role
    navigate("/login");
  };

  return (
    <header className="bg-green-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <img
            src="/LogoSiaci.png"
            alt="SiAci Yummy Logo"
            className="w-12 h-12 rounded-full border-4 border-white shadow-lg"
          />
          <h1 className="text-2xl font-bold">SiAci Yummy</h1>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li className="flex items-center gap-2 text-gray-200 hover:text-white transition duration-200">
              <House className="w-5 h-5" />
              <Link to="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li className="flex items-center gap-2 text-gray-200 hover:text-white transition duration-200 relative">
              <ShoppingBasket className="w-5 h-5" />
              <Link to="/products" className="hover:underline">
                Product
              </Link>
              {productCount > 0 && (
                <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {productCount}
                </span>
              )}
            </li>
            <li className="flex items-center gap-2 text-gray-200 hover:text-white transition duration-200 relative">
              <History className="w-5 h-5" />
              <Link to="/history" className="hover:underline">
                History
              </Link>
              {historyCount > 0 && (
                <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {historyCount}
                </span>
              )}
            </li>
            <li className="flex items-center gap-2 text-gray-200 hover:text-white transition duration-200 relative">
              <Link to="/cart" className="hover:underline">
                {" "}
                <ShoppingCart className="w-5 h-5" />
              </Link>
              {keranjang.length > 0 && (
                <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {keranjang.length}
                </span>
              )}
            </li>
            <li className="flex items-center gap-2 text-gray-200 hover:text-white transition duration-200">
              <Info className="w-5 h-5" />
              <Link to="/about" className="hover:underline">
                About
              </Link>
            </li>
            {userRole ? (
              <li className="flex items-center gap-2 text-gray-200 hover:text-white transition duration-200">
                <LogOut className="w-5 h-5" />
                <button onClick={handleLogout} className="hover:underline">
                  Logout
                </button>
              </li>
            ) : (
              <>
                <li className="flex items-center gap-2 text-gray-200 hover:text-white transition duration-200">
                  <LogIn className="w-5 h-5" />
                  <Link to="/login" className="hover:underline">
                    Login
                  </Link>
                </li>
                <li className="flex items-center gap-2 text-gray-200 hover:text-white transition duration-200">
                  <Link to="/register" className="hover:underline">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
