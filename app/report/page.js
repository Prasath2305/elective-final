"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Report() {
  const [programme, setProgramme] = useState("");
  const [year, setYear] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const programmes = ["B.C.A", "M.C.A", "M.Sc(A.D.S)"];
  const years = ["1", "2", "3", "4"];

  const handleDownload = async () => {
    if (!programme || !year) {
      setError("Please select both Programme and Year.");
      return;
    }
    setError("");
    setLoading(true);

    const token = localStorage.getItem("jwtToken");
    if (!token) {
      router.push("/otp");
      return;
    }

    const batch = programme.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    const batchId = `${batch}${year}`;

    try {
      const response = await fetch(
        `http://localhost:8080/admin/download?batch=${batch}&year=${year}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "Failed to download report.");
        setLoading(false);
        return;
      }

      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `${batchId}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setLoading(false);
      router.push("/dashboard");
    } catch (error) {
      setError("Server error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen bg-blue-50 p-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2
        className="text-3xl font-semibold mb-4 text-blue-800"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        Download Electives Report
      </motion.h2>

      <motion.div
        className="bg-white shadow-lg p-6 rounded-xl w-full max-w-md"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="mb-4">
          <label className="block text-blue-700 font-medium mb-2">
            Programme
          </label>
          <motion.select
            value={programme}
            onChange={(e) => setProgramme(e.target.value)}
            className="w-full p-2 border border-blue-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-300 outline-none"
            whileFocus={{ scale: 1.02 }}
          >
            <option value="">Select Programme</option>
            {programmes.map((prog) => (
              <option key={prog} value={prog}>
                {prog}
              </option>
            ))}
          </motion.select>
        </div>

        <div className="mb-4">
          <label className="block text-blue-700 font-medium mb-2">Year</label>
          <motion.select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full p-2 border border-blue-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-300 outline-none"
            whileFocus={{ scale: 1.02 }}
          >
            <option value="">Select Year</option>
            {years.map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </motion.select>
        </div>

        {error && (
          <motion.p
            className="text-red-500 text-sm mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </motion.p>
        )}

        <motion.button
          onClick={handleDownload}
          className={`w-full py-2 rounded-lg text-white transition-all duration-200 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 shadow-md"
          }`}
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {loading ? (
            <motion.div
              className="flex justify-center items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <span className="animate-spin border-t-2 border-white border-solid rounded-full w-4 h-4"></span>
              Downloading...
            </motion.div>
          ) : (
            "Download Report"
          )}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
