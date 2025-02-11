"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (email === "muhammadf4060@gmail.com" && password === "faizan") {
      localStorage.setItem("isLoggedIn", "true");
      Swal.fire({
        title: "Login Successfully.!",
        icon: "success",
        draggable: true
      });
      router.push("/admin/dashboard");
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Invalid email or password!",
      });
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <form 
        onSubmit={handleLogin} 
        className="bg-white p-8 rounded-2xl shadow-lg max-w-sm w-full space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-gray-700">Admin Login</h2>
        <div>
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 transition-all text-white px-4 py-3 rounded-lg w-full font-semibold shadow-md"
        >
          Login
        </button>
      </form>
    </div>
  );
}
