"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export const getAuthHeaders = () => {
  const token = localStorage.getItem("jwtToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export default function Dashboard() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800 shadow-2xl rounded-xl p-8 w-full max-w-md text-center"
      >
        <h2 className="text-3xl font-semibold mb-6 text-white">Admin Dashboard</h2>

        {[ 
          { label: "📅 Schedule Elective", path: "/schedule" },
          { label: "📊 View Reports", path: "/report" },
          { label: "🏫 Enter Student Details", path: "/StudentUpload" },
        ].map((btn, index) => (
          <motion.button
            key={index}
            onClick={() => router.push(btn.path)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-blue-600 text-white px-5 py-3 rounded-lg mb-3 transition duration-300 hover:bg-blue-500"
          >
            {btn.label}
          </motion.button>
        ))}

        <motion.button
          onClick={handleLogout}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-red-500 text-white px-5 py-3 rounded-lg hover:bg-red-600 transition duration-300"
        >
          🚪 Logout
        </motion.button>
      </motion.div>
    </div>
  );
}