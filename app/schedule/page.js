"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export const getAuthHeaders = () => {
  const token = localStorage.getItem("jwtToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export default function ScheduleElective() {
  const [formData, setFormData] = useState({
    programme: "bca",
    year: "",
    sem: "",
    date: "",
    start_time: "",
    end_time: "",
  });
  
  const [sections, setSections] = useState([{ label: "A", strength: "" }]);
  const [electives, setElectives] = useState([[{ subjectName: "", subCode: "" }]]);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const addSection = () => {
    if (sections.length >= 26) return;
    const nextLabel = String.fromCharCode("A".charCodeAt(0) + sections.length);
    setSections([...sections, { label: nextLabel, strength: "" }]);
  };

  const addElectiveBucket = () => {
    setElectives([...electives, [{ subjectName: "", subCode: "" }]]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.date || !formData.start_time || !formData.end_time) {
      setMessage("❌ Fill in all date and time fields.");
      return;
    }
    try {
      const response = await axios.post("http://localhost:8080/admin/scheduleElective", formData, {
        headers: getAuthHeaders(),
      });
      setMessage("✅ Elective scheduled successfully!");
      setTimeout(() => router.push("/dashboard"), 2000);
    } catch (error) {
      setMessage("❌ Error scheduling elective.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-2xl"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Schedule Elective</h2>
        {message && <div className={`p-3 mb-4 rounded ${message.includes("✅") ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}>{message}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">Programme</label>
          <select name="programme" value={formData.programme} onChange={handleChange} className="w-full p-2 border rounded">
            <option value="bca">B.C.A</option>
            <option value="mca">M.C.A</option>
            <option value="mscads">M.S.C(ADS)</option>
          </select>

          <label className="block">Year</label>
          <input name="year" type="number" value={formData.year} onChange={handleChange} className="w-full p-2 border rounded" required />

          <label className="block">Semester</label>
          <input name="sem" type="number" value={formData.sem} onChange={handleChange} className="w-full p-2 border rounded" required />

          <label className="block">Date</label>
          <input name="date" type="date" value={formData.date} onChange={handleChange} className="w-full p-2 border rounded" required />

          <label className="block">Start Time</label>
          <input name="start_time" type="time" value={formData.start_time} onChange={handleChange} className="w-full p-2 border rounded" required />

          <label className="block">End Time</label>
          <input name="end_time" type="time" value={formData.end_time} onChange={handleChange} className="w-full p-2 border rounded" required />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-xl shadow-md hover:bg-blue-700"
          >
            Schedule Elective
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
}
