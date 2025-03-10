"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function OtpPage() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email");

  useEffect(() => {
    if (!email) {
      router.replace("/email");
    }
  }, [email, router]);

  if (!email) return null; // Prevent rendering if email is missing

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/otp/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: Number(otp) }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.removeItem("jwtToken");
        localStorage.setItem("jwtToken", data.token);
        const decodedToken = parseJwt(data.token);

        setLoading(false);
        router.push(decodedToken?.role === "ADMIN" ? "/dashboard" : "/ElectiveSelection");
      } else {
        setLoading(false);
        setError(data.message || "Invalid OTP. Try again.");
      }
    } catch {
      setLoading(false);
      setError("Server error. Please try again.");
    }
  };

  const parseJwt = (token: string) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch {
      return null;
    }
  };

  return (
    <div className="otp-container">
      <div className="otp-box">
        <h2 className="otp-title">Enter OTP</h2>
        <p className="otp-subtitle">OTP sent to: {email}</p>

        <form onSubmit={handleSubmit} className="otp-form">
          <input
            type="text"
            maxLength={6}
            pattern="[0-9]*"
            inputMode="numeric"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            className="otp-input"
          />

          <button type="submit" disabled={loading} className="otp-button">
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Verifying...
              </>
            ) : (
              "Verify OTP"
            )}
          </button>
        </form>

        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}
