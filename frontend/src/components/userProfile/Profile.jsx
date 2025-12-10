import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  FaShoppingBag,
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
} from "react-icons/fa";
import { toast } from "react-hot-toast"; // ADD THIS IMPORT

export default function Profile() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  const navigate = useNavigate();

  // Fetch user data
  useEffect(() => {
    const token = localStorage.getItem("userToken");

    axios
      .get("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data.user))
      .catch((err) => console.error("Error fetching user:", err))
      .finally(() => setLoading(false));
  }, []);

  // Fetch user orders - SINGLE useEffect (remove the duplicate)
  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("userToken");

      if (!token) {
        console.log("❌ No token found");
        setOrdersLoading(false);
        return;
      }

      try {
        console.log(
          "📦 Fetching orders with token:",
          token.substring(0, 20) + "..."
        );

        // First, let's check if the user exists
        const userRes = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("📦 User ID from /api/auth/me:", userRes.data.user?._id);

        // Now fetch orders
        const response = await axios.get(
          "http://localhost:5000/api/orders/my",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("📦 Orders API Response:", response.data);
        console.log("📦 Success status:", response.data.success);
        console.log("📦 Number of orders:", response.data.orders?.length || 0);

        if (response.data.success) {
          setOrders(response.data.orders);
          console.log("✅ Orders set in state:", response.data.orders);
        } else {
          console.error("❌ API returned success: false", response.data);
        }
      } catch (error) {
        console.error("❌ Error fetching orders:", error);
        console.error("❌ Error response:", error.response?.data);
        console.error("❌ Error status:", error.response?.status);
        console.error("❌ Error config URL:", error.config?.url);
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, []); // Remove the duplicate useEffect below this one

  // DELETE ACCOUNT
  const deleteAccount = async () => {
    const token = localStorage.getItem("userToken");

    try {
      await axios.delete("http://localhost:5000/api/user/delete-account", {
        headers: { Authorization: `Bearer ${token}` },
      });

      localStorage.removeItem("userToken");
      navigate("/login");
    } catch (err) {
      alert("Failed to delete account.", err);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Get status badge style
  const getStatusBadge = (status) => {
    switch (status) {
      case "delivered":
        return {
          bg: "bg-green-100",
          text: "text-green-700",
          icon: <FaCheckCircle className="mr-1" />,
          label: "Delivered",
        };
      case "cancelled":
        return {
          bg: "bg-red-100",
          text: "text-red-700",
          icon: <FaTimesCircle className="mr-1" />,
          label: "Cancelled",
        };
      case "out-for-delivery":
        return {
          bg: "bg-blue-100",
          text: "text-blue-700",
          icon: <FaTruck className="mr-1" />,
          label: "Out for Delivery",
        };
      case "confirmed":
      case "preparing":
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-700",
          icon: <FaClock className="mr-1" />,
          label: status.charAt(0).toUpperCase() + status.slice(1),
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-700",
          icon: <FaClock className="mr-1" />,
          label: "Processing",
        };
    }
  };

  //handle cancle order

  // CANCEL ORDER FUNCTION
  // In your Profile component, update the handleCancelOrder function:
  const handleCancelOrder = async (orderId) => {
    const token = localStorage.getItem("userToken");

    if (!token) {
      toast.error("Please login again");
      return;
    }

    // Confirm before cancelling
    const isConfirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!isConfirmed) {
      return; // User clicked "Cancel"
    }

    try {
      // IMPORTANT: Update this URL to match your backend route
      const response = await axios.put(
        `http://localhost:5000/api/orders/cancel/${orderId}`, // Changed from /:id/cancel to /cancel/:id
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        toast.success("Order cancelled successfully!");

        // Update the orders in state
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId
              ? { ...order, orderStatus: "cancelled" }
              : order
          )
        );
      } else {
        toast.error(response.data.message || "Failed to cancel order");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error(error.response?.data?.message || "Failed to cancel order");
    }
  };

  // Get payment status badge
  const getPaymentBadge = (status) => {
    switch (status) {
      case "paid":
        return {
          bg: "bg-green-100",
          text: "text-green-700",
          label: "Paid",
        };
      case "pending":
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-700",
          label: "Pending",
        };
      case "failed":
        return {
          bg: "bg-red-100",
          text: "text-red-700",
          label: "Failed",
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-600",
          label: status,
        };
    }
  };

  if (loading)
    return (
      <div className="h-screen flex justify-center items-center text-xl">
        Loading Profile...
      </div>
    );

  // Fallback Initial Letter
  const initial = user?.username
    ? user.username.charAt(0).toUpperCase()
    : user?.name
    ? user.name.charAt(0).toUpperCase()
    : "U";

  const hasProfilePic = Boolean(user?.profilePicture);

  return (
    <div className="font-display bg-[#f8f7f6] min-h-screen text-[#181411] px-4 py-10">
      <div className="mx-auto w-full max-w-7xl flex flex-col lg:flex-row gap-8">
        {/* SIDEBAR */}
        <aside className="w-full lg:w-72 flex-shrink-0">
          <div className="sticky top-10 flex flex-col justify-between h-full min-h-[650px] rounded-xl bg-white p-6 shadow-sm">
            {/* User Header */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                {hasProfilePic ? (
                  <img
                    src={user.profilePicture}
                    alt="profile"
                    className="w-12 h-12 rounded-full object-cover border"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">
                    {initial}
                  </div>
                )}
                <div className="truncate">
                  <h1 className="text-base font-bold truncate">{user?.name}</h1>
                  <p className="text-sm text-gray-500 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>

              {/* Menu */}
              <div className="mt-4 flex flex-col gap-2">
                <button className="flex items-center gap-3 rounded-lg bg-orange-200/40 text-orange-600 font-bold px-3 py-2">
                  My Profile
                </button>
                <a
                  href="#order-history"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-200/30"
                >
                  Order History
                </a>
                <button className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-200/30">
                  Setting
                </button>
                <Link to="/admin-login">
                  <button className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-200/30">
                    Admin Login
                  </button>
                </Link>
              </div>
            </div>

            {/* Logout & Delete */}
            <div className="flex gap-2 mt-6">
              <button className="w-full bg-[#FFEFDC] text-[#FF6900] py-2 rounded-lg font-medium hover:bg-[#fbe3c5]">
                Logout
              </button>
              <button className="w-full bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700">
                Delete Account
              </button>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <section className="flex-1 flex flex-col gap-8">
          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
              {hasProfilePic ? (
                <img
                  src={user.profilePicture}
                  alt="profile"
                  className="w-28 h-28 rounded-full object-cover border"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-orange-500 text-white flex items-center justify-center text-4xl font-bold">
                  {initial}
                </div>
              )}
              <div className="text-center sm:text-left">
                <h1 className="text-xl font-semibold">{user?.name}</h1>
                <p className="text-gray-500">@{user?.username}</p>
              </div>
            </div>

            {/* Personal Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 font-medium">Full Name</p>
                <p className="text-base font-semibold mt-1">{user?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Email</p>
                <p className="text-base font-semibold mt-1">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">
                  Phone Number
                </p>
                <p className="text-base font-semibold mt-1">
                  {user?.phone || "Not Added"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">
                  Delivery Address
                </p>
                <p className="text-base font-semibold mt-1">
                  {user?.address
                    ? `${user.address.street || ""}, ${
                        user.address.city || ""
                      }, ${user.address.state || ""}, ${
                        user.address.pincode || ""
                      }`
                    : "Not Added"}
                </p>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Link to="/edit-profile">
                <button className="px-6 py-2 bg-[#dfa26d] text-white font-semibold rounded-lg hover:bg-[#c98f5f] transition">
                  Edit Profile
                </button>
              </Link>
            </div>
          </div>

          {/* Order History */}
          <div
            id="order-history"
            className="bg-white rounded-xl shadow-sm p-6 overflow-x-auto"
          >
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
              <div>
                <h2 className="text-2xl font-bold mb-1">Order History</h2>
                <p className="text-gray-500">Review your past purchases.</p>
              </div>
              <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition">
                Refresh Orders
              </button>
            </div>

            {ordersLoading ? (
              <div className="text-center py-10">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#dda56a] mb-4"></div>
                <p className="text-gray-500">Loading orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-gray-400 text-6xl mb-4">📦</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No Orders Yet
                </h3>
                <p className="text-gray-500 mb-6">
                  You haven't placed any orders yet.
                </p>
                <Link to="/menu">
                  <button className="px-6 py-3 bg-[#dda56a] text-white rounded-lg hover:bg-[#c8955f] transition font-semibold">
                    Start Shopping
                  </button>
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => {
                  const statusBadge = getStatusBadge(order.orderStatus);
                  const paymentBadge = getPaymentBadge(order.paymentStatus);
                  return (
                    <div
                      key={order._id}
                      className="border rounded-xl p-5 hover:shadow-md transition-shadow"
                    >
                      {/* Order header */}
                      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <FaShoppingBag className="text-[#dda56a]" />
                            <h3 className="font-bold text-lg">
                              Order #{order._id.slice(-8).toUpperCase()}
                            </h3>
                          </div>
                          <p className="text-sm text-gray-500">
                            Placed on {formatDate(order.createdAt)}
                          </p>
                          {order.deliveredAt && (
                            <p className="text-sm text-gray-500">
                              Delivered on {formatDate(order.deliveredAt)}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${statusBadge.bg} ${statusBadge.text}`}
                          >
                            {statusBadge.icon} {statusBadge.label}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${paymentBadge.bg} ${paymentBadge.text}`}
                          >
                            {paymentBadge.label}
                          </span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="mb-4 overflow-x-auto">
                        <div className="flex gap-2">
                          {order.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 min-w-[120px]"
                            >
                              {item.img && (
                                <img
                                  src={item.img}
                                  alt={item.name}
                                  className="w-10 h-10 rounded object-cover"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "/cake5.jpg";
                                  }}
                                />
                              )}
                              <div>
                                <p className="text-sm font-medium truncate">
                                  {item.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {item.qty} × ₹{item.price}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-3 mt-4">
                        <Link to={`/order-details/${order._id}`}>
                          <button className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
                            View Details
                          </button>
                        </Link>

                        {order.orderStatus === "delivered" && (
                          <button className="px-4 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition">
                            Rate Order
                          </button>
                        )}

                        {["created", "confirmed", "preparing"].includes(
                          order.orderStatus
                        ) && (
                          <button
                            onClick={() => handleCancelOrder(order._id)}
                            className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Cancel Order
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
