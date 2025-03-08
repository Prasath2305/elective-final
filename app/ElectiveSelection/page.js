"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ElectiveSelection() {
  const [electives, setElectives] = useState([]);
  const [selectedElectives, setSelectedElectives] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchElectives = async () => {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        router.push("/otp");
        return;
      }

      try {
        const response = await fetch("http://localhost:8080/student/getElectives", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 401) {
          router.push("/otp");
          return;
        }

        if (response.status === 204) {
          setError("No electives available. They are either not scheduled or already selected.");
          setTimeout(() => router.push("/"), 3000);
          return;
        }

        if (!response.ok) {
          setError("Failed to fetch electives. Please try again.");
          return;
        }

        const data = await response.json();
        setElectives(data);
      } catch {
        setError("Server error. Try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchElectives();
  }, [router]);

  const handleSelection = (groupIndex, subcode) => {
    const elective = electives[groupIndex].find((elec) => elec.subcode === subcode);
    if (elective) {
      setSelectedElectives((prev) => ({
        ...prev,
        [groupIndex]: { name: elective.elective, subcode: elective.subcode },
      }));
    }
  };

  const handleSubmit = async () => {
    if (Object.keys(selectedElectives).length !== electives.length) {
      setError("Please select one elective from each category.");
      return;
    }
    setError("");

    const token = localStorage.getItem("jwtToken");
    const subCodeList = Object.values(selectedElectives).map((elec) => elec.subcode);

    try {
      const response = await fetch("http://localhost:8080/student/saveElectives", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ subCodeList }),
      });

      if (response.ok) {
        setSuccessMessage("You have successfully selected your electives! Redirecting...");
        localStorage.removeItem("jwtToken");

        setTimeout(() => {
          router.push("/");
        }, 4000);
      } else {
        const result = await response.text();
        setError(result);
        if (result.includes("is full")) {
          setTimeout(() => window.location.reload(), 500);
        }
      }
    } catch {
      setError("Server error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="bg-gray-800 shadow-xl rounded-xl p-6 w-full max-w-md text-center">
        <h2 className="text-2xl font-semibold mb-4 text-white">Select Your Electives</h2>

        {loading ? (
          <p className="text-gray-400">Loading electives...</p>
        ) : (
          <div>
            {error && <p className="text-red-500 mb-3">{error}</p>}
            {successMessage && <p className="text-green-500 mb-3">{successMessage}</p>}

            {electives.length > 0 &&
              electives.map((group, groupIndex) => (
                <div key={groupIndex} className="mb-4">
                  <h3 className="text-white mb-2">Elective Group {groupIndex + 1}</h3>
                  <select
                    className="w-full bg-gray-700 text-white p-2 rounded-md"
                    onChange={(e) => handleSelection(groupIndex, e.target.value)}
                    value={selectedElectives[groupIndex]?.subcode || ""}
                  >
                    <option value="">Select an elective</option>
                    {group.map((elective) => (
                      <option key={elective.subcode} value={elective.subcode}>
                        {elective.elective} ({elective.subcode})
                      </option>
                    ))}
                  </select>
                </div>
              ))}

            {electives.length > 0 && (
              <button
                onClick={handleSubmit}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-500 transition duration-300"
              >
                Submit
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
