// ProjectStatus.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function ProjectStatus() {
  const [statusList, setStatusList] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/");
          return;
        }

        const res = await fetch(`https://trackly-a750.onrender.com/project/status`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          setError("Failed to fetch project status");
          setLoading(false);
          return;
        }

        const data = await res.json();
        setStatusList(data);
        setLoading(false);
      } catch (err) {
        setError("Error loading status");
        setLoading(false);
      }
    };

    fetchStatus();
  }, [navigate]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #dceefb 0%, #f8f9fa 100%)",
        padding: "2rem 0",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div className="container">
        <div
          style={{
            background: "#fff",
            padding: "1.75rem",
            borderRadius: 20,
            boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
            maxWidth: "900px",
            margin: "auto",
          }}
        >
          <h2
            className="text-center fw-bold mb-4"
            style={{
              background: "linear-gradient(90deg, #007bff, #00c4cc)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            🔍 Project Status
          </h2>

          {error && <div className="alert alert-danger">{error}</div>}

          {loading && !error && (
            <p className="text-center fst-italic" style={{ color: "#6c757d" }}>
              Loading project status...
            </p>
          )}

          {!loading && statusList.length === 0 && !error && (
            <p className="text-center fst-italic">No status available</p>
          )}

          <div className="row">
            {!loading &&
              statusList.map((status, idx) => (
                <div key={idx} className="col-12 mb-3">
                  <div className="card shadow-sm">
                    <div className="card-body d-flex justify-content-between align-items-start">
                      <div>
                        <h5 className="card-title mb-1">{status.projectName}</h5>
                        <p className="mb-1">
                          Status:{" "}
                          <strong
                            style={{
                              color: status.status === "UP" ? "#198754" : "#dc3545",
                            }}
                          >
                            {status.status}
                          </strong>
                        </p>
                        <p className="text-muted mb-0">
                          Last Updated: {new Date(status.updated_at).toLocaleString()}
                        </p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        {/* small badge */}
                        <span
                          className={`badge ${
                            status.status === "UP" ? "bg-success" : "bg-danger"
                          }`}
                          style={{ fontSize: 12, padding: "0.5em 0.6em" }}
                        >
                          {status.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectStatus;
