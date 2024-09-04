import { useState, useContext } from "react";
import Cookies from "js-cookie";
import { KrjContext } from "../App";
import { Trash, ShoppingCart } from "lucide-react";

export default function Cart() {
  const { keranjang, setKeranjang } = useContext(KrjContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const removeFromCart = (productId) => {
    setKeranjang((prev) => prev.filter((item) => item.id !== productId));
  };

  const increaseQuantity = (productId) => {
    setKeranjang((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (productId) => {
    setKeranjang((prev) =>
      prev.map((item) =>
        item.id === productId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const handleCheckout = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ name: "", address: "", phone: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = Cookies.get("token");

    if (!token) {
      setMessage("Authentication required. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...formData,
            items: keranjang.map((item) => ({
              product_id: item.id,
              quantity: item.quantity,
              price: item.price,
            })),
          }),
        }
      );

      if (response.ok) {
        setMessage("Order placed successfully!");
        setKeranjang([]);
      } else {
        setMessage("Failed to place order.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      setMessage("An error occurred while placing the order.");
    } finally {
      setLoading(false);
      handleCloseModal();
    }
  };

  const totalPrice = keranjang.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const redirectToLogin = () => (location.href = "/login");
  if (!Cookies.get("token")) redirectToLogin();
  else
    return (
      <div className="bg-gray-100 min-h-screen">
        <main className="container mx-auto p-6">
          <h2 className="text-3xl font-semibold mb-6 text-center">
            Shopping Cart
          </h2>

          {message && (
            <div className="bg-green-500 text-white p-4 rounded-md mb-4">
              {message}
            </div>
          )}

          {keranjang.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[300px]">
              <ShoppingCart className="w-24 h-24 text-gray-400 mb-4" />
              <p className="text-lg text-gray-600">Your cart is empty</p>
            </div>
          ) : (
            <div>
              <ul className="space-y-4">
                {keranjang.map((item) => (
                  <li
                    key={item.id}
                    className="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-4"
                  >
                    <img
                      src={item.imageurl}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold">{item.name}</h3>
                      <p className="text-gray-600">
                        Rp {item.price.toLocaleString()}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <button
                          className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-2 py-1 rounded-md"
                          onClick={() => decreaseQuantity(item.id)}
                        >
                          -
                        </button>
                        <span className="text-lg font-medium">
                          {item.quantity}
                        </span>
                        <button
                          className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-2 py-1 rounded-md"
                          onClick={() => increaseQuantity(item.id)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash />
                    </button>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <h3 className="text-2xl font-semibold">
                  Total Price: Rp {totalPrice.toLocaleString()}
                </h3>
                <button
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
                  onClick={handleCheckout}
                >
                  Checkout
                </button>
              </div>
            </div>
          )}
        </main>

        {/* Modal for Checkout Form */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h3 className="text-2xl font-semibold mb-4">Checkout</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
                <div className="flex justify-between">
                  <button
                    type="button"
                    className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md"
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "Submit Order"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
}
