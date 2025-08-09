// Projects.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await fetch(`${import.meta.env.VITE_API_URL}/project`, {
          method: "GET",
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
      } catch (err) {
        setError("An error occurred while fetching projects");
        console.error(err);
      }
    };

    fetchProjects();
  }, [navigate]);

  const handleCreate = () => navigate("/create");
  const handleDashboard = () => navigate("/dashboard");

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this project?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8080/project/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        showMessage("❌ Failed to delete project", "danger");
        return;
      }

      setProjects(projects.filter((project) => project.id !== id));
      showMessage("✅ Project deleted successfully", "success");
    } catch (err) {
      showMessage("⚠️ Error while deleting project", "danger");
      console.error(err);
    }
  };

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
            padding: "2rem",
            borderRadius: "20px",
            boxShadow: "0px 8px 20px rgba(0,0,0,0.08)",
            maxWidth: "1100px",
            margin: "auto",
          }}
        >
          <h2
            className="text-center fw-bold"
            style={{
              fontSize: "2.2rem",
              background: "linear-gradient(90deg, #007bff, #00c4cc)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: "1.5rem",
            }}
          >
            📂 Your Projects
          </h2>

          {message && (
            <div
              className={`alert alert-${message.type} text-center fw-semibold`}
              style={{
                fontSize: "0.95rem",
                borderRadius: "10px",
                boxShadow: "0px 4px 12px rgba(0,0,0,0.05)",
              }}
              role="alert"
            >
              {message.text}
            </div>
          )}
          {error && <div className="alert alert-danger">{error}</div>}

          <div className="d-flex flex-wrap gap-2 justify-content-end mb-4">
            <button
              className="btn"
              onClick={handleCreate}
              style={{
                backgroundColor: "#007bff",
                border: "none",
                color: "#fff",
                fontWeight: 600,
                borderRadius: 8,
                padding: "8px 14px",
              }}
            >
              + Create Project
            </button>

            <button
              className="btn"
              onClick={handleDashboard}
              style={{
                backgroundColor: "#20c997",
                border: "none",
                color: "#fff",
                fontWeight: 600,
                borderRadius: 8,
                padding: "8px 14px",
              }}
            >
              📊 Dashboard
            </button>

            <button
              className="btn"
              onClick={() => navigate("/status")}
              style={{
                backgroundColor: "#6f42c1",
                border: "none",
                color: "#fff",
                fontWeight: 600,
                borderRadius: 8,
                padding: "8px 14px",
              }}
            >
              🔍 Status
            </button>
          </div>

          {projects.length === 0 && !error && (
            <p className="text-center fst-italic text-muted">No project found</p>
          )}

          <div className="row">
            {projects.map((project) => (
              <div className="col-md-6 col-lg-4 mb-4" key={project.id}>
                <div
                  className="card h-100 border-0"
                  style={{
                    borderRadius: 15,
                    boxShadow: "0px 6px 15px rgba(0,0,0,0.06)",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    overflow: "hidden",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow =
                      "0px 10px 25px rgba(0,0,0,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0px)";
                    e.currentTarget.style.boxShadow =
                      "0px 6px 15px rgba(0,0,0,0.06)";
                  }}
                >
                  <div className="card-body">
                    <h5 className="fw-bold" style={{ color: "#007bff", fontSize: "1.1rem" }}>
                      {project.name}
                    </h5>
                    <p className="text-muted">{project.description}</p>
                    <p>
                      <small className="text-secondary">
                        Created at: {new Date(project.created_at).toLocaleString()}
                      </small>
                    </p>
                    <div className="d-flex gap-2 mt-3">
                      <button
                        className="btn btn-sm"
                        onClick={() => navigate(`/edit/${project.id}`)}
                        style={{
                          backgroundColor: "#ffb84d",
                          border: "none",
                          fontWeight: 600,
                        }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="btn btn-sm"
                        onClick={() => handleDelete(project.id)}
                        style={{
                          backgroundColor: "#dc3545",
                          border: "none",
                          fontWeight: 600,
                        }}
                      >
                        🗑️ Delete
                      </button>
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

export default Projects;
