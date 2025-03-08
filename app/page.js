"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail } from "lucide-react";

export default function EmailPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.endsWith("@srmist.edu.in")) {
      setError("Please login with SRM ID");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/otp/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        router.push(`/otp?email=${email}`);
      } else {
        setError(data.message || "Failed to send OTP. Try again.");
      }
    } catch {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg p-8 rounded-xl w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Elective Polling System</h2>
        <p className="text-gray-600 text-sm mb-6">Use your SRM email to receive an OTP</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-500" />
            <input
              type="email"
              placeholder="yourname@srmist.edu.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 bg-gray-50 text-gray-700"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-900 transition"
          >
            {loading ? "Sending OTP..." : "Get OTP"}
          </button>
        </form>
        {error && <p className="text-red-500 text-sm mt-4">❌ {error}</p>}
      </div>
    </div>
  );
}
