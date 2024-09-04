import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { ArrowDownUp, Printer } from "lucide-react";

export default function OrderHistory() {
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' for ascending, 'desc' for descending

  const token = Cookies.get("token");

  useEffect(() => {
    if (!token) {
      location.href = "/login";
      return;
    }

    const fetchOrderHistory = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/orderHistory`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          data.sort((a, b) => {
            const dateA = new Date(a.created_at);
            const dateB = new Date(b.created_at);
            return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
          });
          setOrderHistory(data);
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

    fetchOrderHistory();
  }, [token, sortOrder]);

  const handlePrint = () => {
    window.print();
  };

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  if (loading) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6 relative">
      {orderHistory.length > 0 && (
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={handlePrint}
            aria-label="Print Order History"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Printer className="inline mr-2" />
            Print
          </button>
          <button
            onClick={toggleSortOrder}
            aria-label={`Sort by date (${sortOrder === "asc" ? "Descending" : "Ascending"})`}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            <ArrowDownUp className="inline mr-2" />
            Sort by Date: {sortOrder === "asc" ? "Ascending" : "Descending"}
          </button>
        </div>
      )}
      <h2 className="text-3xl font-semibold mb-6 text-center">Order History</h2>
      {orderHistory.length === 0 ? (
        <p className="text-center text-gray-600">No orders found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
            <thead className="bg-purple-500">
              <tr>
                <th className="p-4 text-left text-sm font-medium text-white">Order ID</th>
                <th className="p-4 text-left text-sm font-medium text-white">Product ID</th>
                <th className="p-4 text-left text-sm font-medium text-white">Quantity</th>
                <th className="p-4 text-left text-sm font-medium text-white">Price</th>
                <th className="p-4 text-left text-sm font-medium text-white">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orderHistory.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="p-4 text-sm text-gray-700">{order.order_id}</td>
                  <td className="p-4 text-sm text-gray-700">{order.product_id}</td>
                  <td className="p-4 text-sm text-gray-700">{order.quantity}</td>
                  <td className="p-4 text-sm text-gray-700">Rp {order.price.toLocaleString()}</td>
                  <td className="p-4 text-sm text-gray-700">{new Date(order.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
