"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CloudUpload } from "lucide-react";

export default function StudentUpload() {
  const [programme, setProgramme] = useState("");
  const [year, setYear] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const programmes = ["B.C.A", "M.C.A", "M.Sc(A.D.S)"];
  const years = ["1", "2", "3", "4"];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.name.endsWith(".xlsx")) {
      setFile(selectedFile);
      setError("");
    } else {
      setError("Only .xlsx files are allowed.");
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!programme || !year || !file) {
      setError("Please select Programme, Year, and upload a file.");
      return;
    }

    const token = localStorage.getItem("jwtToken");
    if (!token) {
      router.push("/otp");
      return;
    }

    const batch = programme.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("batch", batch);
    formData.append("year", year);

    try {
      const response = await fetch("http://localhost:8080/admin/upload-students", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (response.ok) {
        setSuccess("Students uploaded successfully!");
        setTimeout(() => router.push("/dashboard"), 2000);
      } else {
        setError("Failed to upload students.");
      }
    } catch (error) {
      setError("Server error. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Upload Student Details</h2>

      <div className="bg-white shadow-lg p-8 rounded-xl w-full max-w-md">
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Programme</label>
          <select
            value={programme}
            onChange={(e) => setProgramme(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 bg-gray-50"
          >
            <option value="">🎓 Select Programme</option>
            {programmes.map((prog) => (
              <option key={prog} value={prog}>
                {prog}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Year</label>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 bg-gray-50"
          >
            <option value="">📅 Select Year</option>
            {years.map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Upload Student File (.xlsx)</label>
          <div className="relative border-dashed border-2 border-gray-300 p-6 rounded-lg bg-gray-50 flex flex-col items-center">
            <CloudUpload className="text-gray-500 w-12 h-12 mb-3" />
            <input
              type="file"
              accept=".xlsx"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <span className="text-gray-600 text-sm">Drag & drop or click to upload</span>
          </div>
        </div>

        <div className="bg-blue-100 p-4 rounded-lg text-sm mb-6">
          <p className="font-semibold">📌 Format Guidelines:</p>
          <ul className="list-disc list-inside text-blue-700">
            <li><strong>.xlsx</strong> file format only</li>
            <li>Include: <strong>Name, Section, Email, Regno</strong></li>
            <li>Ensure all columns are present</li>
          </ul>
        </div>

        {error && <p className="text-red-500 text-sm mb-4">❌ {error}</p>}
        {success && <p className="text-green-500 text-sm mb-4">✅ {success}</p>}

        <button
          onClick={handleUpload}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-900 transition"
        >
          Upload Students
        </button>
      </div>
    </div>
  );
}
