import { useState, useEffect, useContext } from "react";
import Cookies from "js-cookie";
import { KrjContext } from "../App";

export default function Order() {
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
          `${import.meta.env.VITE_API_BASE_URL}/api/ordersAll`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setOrders(data);

          // Update historyCount based on the number of unaccepted orders
          const newOrdersCount = data.filter(
            (order) => order.status !== "Accepted"
          ).length;
          setHistoryCount(newOrdersCount);
        } else {
          const errorData = await response.json();
          setError(errorData.message || "Failed to fetch orders.");
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("An error occurred while fetching orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token, setHistoryCount]);
  const updateOrderStatus = async (orderId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/orders/${orderId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "Accepted" }),
        }
      );

      if (response.ok) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.order_id === orderId
              ? { ...order, status: "Accepted" }
              : order
          )
        );

        // Decrement historyCount when an order is accepted
        setHistoryCount((prevCount) => prevCount - 1);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to update order status.");
      }
    } catch (err) {
      console.error("Error updating order status:", err);
      setError("An error occurred while updating the order status.");
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/orders/${orderId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order.order_id !== orderId)
        );

        // Decrement historyCount when an unaccepted order is deleted
        const order = orders.find((order) => order.order_id === orderId);
        if (order && order.status !== "Accepted") {
          setHistoryCount((prevCount) => prevCount - 1);
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to delete order.");
      }
    } catch (err) {
      console.error("Error deleting order:", err);
      setError("An error occurred while deleting the order.");
    }
  };

  if (loading) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen p-6">
      <h2 className="text-3xl font-semibold mb-6 text-center">My Orders</h2>
      {orders.length === 0 ? (
        <p className="text-center text-gray-600">No orders found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-purple-300 rounded-lg shadow-lg">
            <thead className="bg-purple-500">
              <tr>
                {[
                  "Order ID",
                  "Customer Name",
                  "Address",
                  "Phone",
                  "Status",
                  "Product Name",
                  "Quantity",
                  "Price",
                  "Actions",
                ].map((header) => (
                  <th
                    key={header}
                    className="p-4 text-left text-sm font-medium text-black-600"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.order_id} className="hover:bg-gray-50">
                  <td className="p-4 text-sm text-gray-700">
                    {order.order_id}
                  </td>
                  <td className="p-4 text-sm text-gray-700">
                    {order.customer_name}
                  </td>
                  <td className="p-4 text-sm text-gray-700">{order.address}</td>
                  <td className="p-4 text-sm text-gray-700">{order.phone}</td>
                  <td className="p-4 text-sm text-gray-700">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                        order.status === "Accepted"
                          ? "bg-green-200 text-green-800"
                          : "bg-yellow-200 text-yellow-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-700">
                    {order.product_name}
                  </td>
                  <td className="p-4 text-sm text-gray-700">
                    {order.quantity}
                  </td>
                  <td className="p-4 text-sm text-gray-700">
                    Rp {order.price.toLocaleString()}
                  </td>
                  <td className="p-4 text-sm">
                    {order.status !== "Accepted" && (
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300 mr-2"
                        onClick={() => updateOrderStatus(order.order_id)}
                      >
                        Accept Order
                      </button>
                    )}
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-300"
                      onClick={() => deleteOrder(order.order_id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
