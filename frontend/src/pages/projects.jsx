import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/");
          return;
        }

        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/project`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          setError("Failed to fetch projects");
          return;
        }

        const data = await res.json();
        setProjects(data);
      } catch {
        setError("⚠️ Error loading projects");
      }
    };

    fetchProjects();
  }, [navigate]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e9f2ff, #f8f9fa)",
        padding: "2rem 0",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2
            className="fw-bold"
            style={{
              background: "linear-gradient(90deg, #007bff, #00c4cc)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            📁 Projects
          </h2>
          <div>
            <button
              className="btn btn-primary me-2"
              onClick={() => navigate("/create")}
            >
              ➕ Create Project
            </button>
            <button
              className="btn btn-info"
              onClick={() => navigate("/dashboard")}
            >
              📊 Dashboard
            </button>
          </div>
        </div>
        {error && <div className="alert alert-danger text-center">{error}</div>}
        <div className="row g-4">
          {projects.length > 0 ? (
            projects.map((p) => (
              <div key={p.id} className="col-md-4">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body">
                    <h5 className="fw-bold">{p.name}</h5>
                    <p>{p.description}</p>
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-sm btn-outline-primary me-2"
                    >
                      🔗 Visit
                    </a>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => navigate(`/edit/${p.id}`)}
                    >
                      ✏ Edit
                    </button>
                    <button className="btn btn-sm btn-danger">🗑 Delete</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted">No projects found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Projects;