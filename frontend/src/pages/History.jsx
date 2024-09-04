import { useState, useEffect, useContext } from "react";
import Cookies from "js-cookie";
import { KrjContext } from "../App";

export default function History() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { setHistoryCount } = useContext(KrjContext);

  const token = Cookies.get("token");

  useEffect(() => {
    if (!token) {
      location.href = "/login"; // Redirect if no token is found
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/history`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          // Sort orders so that not yet accepted ones appear first
          data.sort((a, b) => (a.status === "Accepted" ? 1 : -1));
          setOrders(data);

          // Set historyCount to the number of orders that are not yet accepted
          const newOrdersCount = data.filter(
            (order) => order.status !== "Accepted"
          ).length;
          setHistoryCount(newOrdersCount);
        } else {
          const errorData = await response.json();
          setError(errorData.message || "Failed to fetch order history.");
        }
      } catch (err) {
        console.error("Error fetching order history:", err);
        setError("An error occurred while fetching order history.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token, setHistoryCount]);

  if (loading) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <h2 className="text-4xl font-bold mb-8 text-center text-gray-800">
        Order History
      </h2>
      {orders.length === 0 ? (
        <p className="text-center text-gray-600">No orders found</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.order_id}
              className="bg-white border border-gray-300 rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105"
            >
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                Order ID: {order.order_id}
              </h3>
              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-600">
                  <strong>Customer Name:</strong> {order.customer_name}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Address:</strong> {order.address}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Phone:</strong> {order.phone}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Status:</strong>
                  <span
                    className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                      order.status === "Accepted"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Product Name:</strong> {order.product_name}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Quantity:</strong> {order.quantity}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Price:</strong> Rp {order.price.toLocaleString()}
                </p>
              </div>
              <p
                className={`text-sm mt-8 ${
                  order.status === "Accepted"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {order.status === "Accepted"
                  ? "Pesanan Anda berhasil kami proses. Pesanan Anda akan segera kami antarkan. Mohon siapkan uang tunai untuk pembayaran pesanan Anda. Terima Kasih"
                  : "Pesanan Anda sedang kami proses. Mohon ditunggu"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
