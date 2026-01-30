"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Image from "next/image";
import {
  HiOutlineShoppingBag,
  HiOutlineCalendar,
  HiOutlineCreditCard,
  HiX,
} from "react-icons/hi";
import { MdOutlineDeliveryDining, MdOutlineReceiptLong } from "react-icons/md";
import Loader from "@/components/Loader/Loader";

export default function AllOrders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const originalStyle = window.getComputedStyle(
      document.body,
    ).backgroundColor;
    document.body.style.backgroundColor = "#0f172a";
    document.title = "Order History | Novalo";

    return () => {
      document.body.style.backgroundColor = originalStyle;
    };
  }, []);

  // Fetch User Orders
  async function getUserOrders() {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) return;

      const { id } = jwtDecode(token);
      const { data } = await axios.get(
        `https://ecommerce.routemisr.com/api/v1/orders/user/${id}`,
      );
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  }
  // Remove Orders state
  const removeOrderFromUI = (orderId) => {
    // Confirmation before removing
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this order from your history?",
    );
    if (!confirmDelete) return;

    setOrders((prevOrders) =>
      prevOrders.filter((order) => order._id !== orderId),
    );
    toast.success("Order deleted successfully");
  };

  useEffect(() => {
    getUserOrders();
  }, []);

  if (isLoading) return <Loader />;

  return (
    <div className="min-h-screen bg-[#0f172a] pt-32 md:pt-28 pb-20">
      <div className="mx-auto max-w-screen-xl px-4">
        {/* Page Header */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 rounded-2xl bg-[#12bb9c]/20 flex items-center justify-center text-[#12bb9c]">
            <HiOutlineShoppingBag size={28} />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Order History
          </h1>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20 bg-[#1e293b] rounded-3xl border border-gray-700/50 shadow-xl">
            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fa-solid fa-box-open text-4xl text-gray-600"></i>
            </div>
            <p className="text-gray-400 font-medium tracking-wide">
              You haven't placed any orders yet.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-[#1e293b] rounded-3xl border border-gray-700/50 overflow-hidden shadow-2xl transition-all hover:border-[#12bb9c]/30"
              >
                <div className="p-6 border-b border-gray-700/50 flex flex-wrap justify-between items-center gap-6 bg-gray-800/30">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-700/50 flex items-center justify-center text-gray-400">
                      <MdOutlineReceiptLong size={22} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1">
                        Order Ref
                      </p>
                      <p className="text-white font-mono text-sm">
                        #{order._id.slice(-8).toUpperCase()}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div
                      className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${order.isPaid ? "bg-[#12bb9c]/10 text-[#12bb9c]" : "bg-orange-500/10 text-orange-500 border border-orange-500/20"}`}
                    >
                      <HiOutlineCreditCard size={14} />
                      {order.isPaid ? "Paid" : "Unpaid"}
                    </div>
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-tighter border border-blue-500/20">
                      <MdOutlineDeliveryDining size={14} />
                      {order.isDelivered ? "Delivered" : "In Transit"}
                    </div>
                  </div>
                </div>

                {/* Order Content */}
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row gap-4 items-center">
                    {/* Left Side: Product Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 grow">
                      {order.cartItems.map((item) => (
                        <div
                          key={item._id}
                          className="group flex gap-4 items-center bg-[#0f172a] p-4 rounded-2xl border border-gray-700/30 transition-colors hover:border-[#12bb9c]/40"
                        >
                          <div className="w-16 h-16 relative rounded-xl overflow-hidden shrink-0 border border-gray-700">
                            <Image
                              src={item.product.imageCover}
                              alt="prod"
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-white text-xs font-bold truncate">
                              {item.product.title}
                            </p>
                            <p className="text-[#12bb9c] text-[11px] font-black mt-1">
                              {item.count} x {item.price} EGP
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Right Side: Delete Button */}
                    <button
                      onClick={() => removeOrderFromUI(order._id)}
                      className="group flex flex-row items-center justify-center gap-2 px-6 py-2 rounded-2xl border-2 border-dashed border-red-500/20 bg-red-500/5 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all cursor-pointer min-w-[120px] lg:self-stretch"
                    >
                      <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center transition-colors group-hover:bg-white/20">
                        <i className="fa-solid fa-trash-can text-sm"></i>
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.15em] whitespace-nowrap">
                        Delete Order
                      </span>
                    </button>
                  </div>
                </div>

                {/* Summary Footer */}
                <div className="px-8 py-5 bg-gray-900/40 border-t border-gray-700/50 flex flex-wrap justify-between items-center gap-4">
                  <div className="flex items-center gap-2 text-gray-500">
                    <HiOutlineCalendar className="text-[#12bb9c]" />
                    <span className="text-[11px] font-bold uppercase tracking-widest">
                      {new Date(order.createdAt).toLocaleDateString(undefined, {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">
                      Grand Total
                    </p>
                    <p className="text-[#12bb9c] font-black text-2xl">
                      {order.totalOrderPrice}{" "}
                      <span className="text-xs ml-1 font-bold">EGP</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
