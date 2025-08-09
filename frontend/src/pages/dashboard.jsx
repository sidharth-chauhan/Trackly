// Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [up, setUp] = useState(0);
  const [down, setDown] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        // Dashboard data
        const res = await fetch(`https://trackly-a750.onrender.com/project/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          setError("Failed to fetch dashboard");
        } else {
          const data = await res.json();
          setDashboardData(data);
        }

        // Status data
        const statusRes = await fetch(`${import.meta.env.VITE_API_URL}/project/status`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (statusRes.ok) {
          const statusData = await statusRes.json();
          setUp(statusData.filter((p) => p.status === "UP").length);
          setDown(statusData.filter((p) => p.status === "DOWN").length);
        } else {
          setError("Failed to fetch status data");
        }
      } catch (err) {
        console.error(err);
        setError("⚠️ An error occurred while fetching dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        <p className="text-muted">⏳ Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #dceefb 0%, #f8f9fa 100%)",
        fontFamily: "'Poppins', sans-serif",
        padding: "2rem 0",
      }}
    >
      <div className="container">
        <div
          style={{
            backgroundColor: "#fff",
            padding: "1.75rem",
            borderRadius: "20px",
            boxShadow: "0px 8px 20px rgba(0,0,0,0.06)",
            maxWidth: "900px",
            margin: "auto",
          }}
        >
          <h2
            className="text-center fw-bold mb-4"
            style={{
              fontSize: "1.9rem",
              background: "linear-gradient(90deg, #007bff, #00c4cc)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            📊 Dashboard
          </h2>

          {error && (
            <div className="alert alert-danger text-center">{error}</div>
          )}

          <div className="row g-4">
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div
                  className="card-body text-center rounded-3 text-white"
                  style={{ background: "#007bff" }}
                >
                  <h6 className="mb-2">Total Projects</h6>
                  <h3 className="fw-bold mb-0">
                    {dashboardData?.TotalProjects ?? "—"}
                  </h3>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div
                  className="card-body text-center rounded-3 text-white"
                  style={{ background: "#20c997" }}
                >
                  <h6 className="mb-2">Projects UP</h6>
                  <h3 className="fw-bold mb-0">{up ?? "—"}</h3>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div
                  className="card-body text-center rounded-3 text-white"
                  style={{ background: "#dc3545" }}
                >
                  <h6 className="mb-2">Projects DOWN</h6>
                  <h3 className="fw-bold mb-0">{down ?? "—"}</h3>
                </div>
              </div>
            </div>
          </div>

          {dashboardData && (
            <div className="mt-4 card border-0 shadow-sm">
              <div className="card-body">
                <p className="mb-2">
                  <strong>📁 Latest Project:</strong>{" "}
                  {dashboardData.latest_projects ?? "—"}
                </p>
                <p className="mb-0">
                  <strong>⏱ Last Updated:</strong>{" "}
                  {dashboardData.last_updated ?? "—"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
