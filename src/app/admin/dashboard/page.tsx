"use client";

import React, { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import Swal from "sweetalert2";
import ProcatedRoute from "@/app/components/procated/ProcatedRoute";

interface Order {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
  total: number;
  discount: number;
  orderDate: string;
  status: string | null;
  cartItems: { productName: string }[];
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    client
      .fetch(
        `*[_type == "order"]{
          _id,
          firstName,
          lastName,
          phone,
          email,
          address,
          city,
          zipCode,
          total,
          discount,
          orderDate,
          status,
          cartItems[]->{ productName }
        }`
      )
      .then((data) => setOrders(data))
      .catch((error) => console.error("Error fetching orders:", error));
  }, []);

  const filteredOrders =
    filter === "All" ? orders : orders.filter((order) => order.status === filter);

  const handleDelete = async (orderId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await client.delete(orderId);
      setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
      Swal.fire("Deleted!", "Your order has been deleted.", "success");
    } catch (error) {
      console.error("Error deleting order:", error);
      Swal.fire("Error!", "Something went wrong while deleting.", "error");
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await client.patch(orderId).set({ status: newStatus }).commit();
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      Swal.fire("Updated!", `Order status changed to ${newStatus}.`, "success");
    } catch (error) {
      console.error("Error updating order status:", error);
      Swal.fire("Error!", "Something went wrong while updating the status.", "error");
    }
  };

  return (
    <ProcatedRoute>
      <div className="flex flex-col h-screen bg-gray-50 p-6">
        <nav className="bg-blue-600 text-white p-4 shadow-md flex justify-between rounded-lg">
          <h2 className="text-2xl font-bold">Admin Dashboard</h2>
          <div className="flex space-x-2">
            {['All', 'pending', 'dispatch', 'success'].map(status => (
              <button
                key={status}
                className={`px-4 py-2 rounded-lg transition-all shadow-md ${
                  filter === status ? 'bg-white text-blue-600 font-bold' : 'bg-blue-500 hover:bg-blue-400 text-white'
                }`}
                onClick={() => setFilter(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </nav>

        <div className="mt-6 overflow-y-auto">
          <h2 className="text-3xl font-bold text-center mb-4 text-gray-700">Orders</h2>
          <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-4">
            <table className="min-w-full divide-y divide-gray-200 text-sm lg:text-base">
              <thead className="bg-gray-100 text-blue-600">
                <tr>
                  <th className="p-2">ID</th>
                  <th className="p-2">Customer</th>
                  <th className="p-2">Address</th>
                  <th className="p-2">Date</th>
                  <th className="p-2">Total</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-100 transition-all">
                    <td className="p-2">{order._id}</td>
                    <td className="p-2">{order.firstName} {order.lastName}</td>
                    <td className="p-2">{order.address}</td>
                    <td className="p-2">{new Date(order.orderDate).toLocaleDateString()}</td>
                    <td className="p-2 font-bold">${order.total}</td>
                    <td className="p-2">
                      <select
                        value={order.status || ""}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="bg-gray-100 p-1 rounded border"
                      >
                        <option value="pending">Pending</option>
                        <option value="dispatch">Dispatch</option>
                        <option value="success">Completed</option>
                      </select>
                    </td>
                    <td className="p-2">
                      <button
                        onClick={() => handleDelete(order._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ProcatedRoute>
  );
}
