import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function ProjectStatus() {
  const [projects, setProjects] = useState([]);
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

        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/project/status`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          setError("Failed to fetch status");
          return;
        }

        const data = await res.json();
        setProjects(data);
      } catch {
        setError("⚠️ Error fetching status");
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [navigate]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p className="text-muted">⏳ Loading status...</p>
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
            📌 Project Status
          </h2>
          {error && <div className="alert alert-danger text-center">{error}</div>}
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p, index) => (
                  <tr key={index}>
                    <td>{p.name}</td>
                    <td
                      style={{
                        color: p.status === "UP" ? "green" : "red",
                        fontWeight: "bold",
                      }}
                    >
                      {p.status}
                    </td>
                    <td>{p.last_updated ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-center mt-3">
            <button
              className="btn btn-secondary"
              onClick={() => navigate("/projects")}
            >
              Back to Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectStatus;