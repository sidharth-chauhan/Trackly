import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function EditProject() {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          // Corrected navigation path
          navigate("/");
          return;
        }

        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/project/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          showMessage("❌ Failed to load project", "danger");
          return;
        }

        const data = await res.json();
        setName(data.name);
        setDescription(data.description);
        setLink(data.link);
      } catch {
        showMessage("⚠️ Error fetching project", "danger");
      }
    };

    fetchProject();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/project/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, description, link }),
      });

      if (!res.ok) {
        showMessage("❌ Failed to update project", "danger");
        return;
      }

      showMessage("✅ Project updated successfully!", "success");
      // Corrected navigation path
      setTimeout(() => navigate("/projects"), 1500);
    } catch {
      showMessage("⚠️ Error updating project", "danger");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #dceefb 0%, #f8f9fa 100%)",
        padding: "2rem 0",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div className="container" style={{ maxWidth: 540 }}>
        <div
          style={{
            background: "#fff",
            padding: "1.5rem",
            borderRadius: 20,
            boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
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
            ✏️ Edit Project
          </h2>

          {message && (
            <div className={`alert alert-${message.type} text-center`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="text"
                placeholder="Project Name"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <input
                type="text"
                placeholder="Project Description"
                className="form-control"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <input
                type="text"
                placeholder="Project Link"
                className="form-control"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditProject;