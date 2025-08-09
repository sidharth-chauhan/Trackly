// CreateProject.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function CreateProject() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const res = await fetch("http://localhost:8080/project", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, description, link }),
      });

      if (!res.ok) {
        showMessage("❌ Failed to create project", "danger");
        return;
      }

      showMessage("✅ Project Created Successfully!", "success");
      setTimeout(() => navigate("/projects"), 1500);
    } catch (err) {
      showMessage("⚠️ Error while creating project", "danger");
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
            maxWidth: "560px",
            margin: "auto",
            backgroundColor: "#fff",
            padding: "2rem",
            borderRadius: "20px",
            boxShadow: "0px 8px 20px rgba(0,0,0,0.06)",
          }}
        >
          <h2
            className="text-center fw-bold"
            style={{
              fontSize: "1.8rem",
              background: "linear-gradient(90deg, #007bff, #00c4cc)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: "1.25rem",
            }}
          >
            ➕ Create New Project
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

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="text"
                placeholder="Project Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="form-control"
                style={{ borderRadius: 8 }}
              />
            </div>

            <div className="mb-3">
              <input
                type="text"
                placeholder="Project Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="form-control"
                style={{ borderRadius: 8 }}
              />
            </div>

            <div className="mb-4">
              <input
                type="text"
                placeholder="Project Link"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                required
                className="form-control"
                style={{ borderRadius: 8 }}
              />
            </div>

            <div className="d-flex gap-2">
              <button
                type="submit"
                className="btn btn-primary flex-grow-1 fw-semibold"
                style={{ borderRadius: 10 }}
              >
                Create
              </button>
              <button
                type="button"
                className="btn btn-light border"
                style={{ borderRadius: 10, width: 140 }}
                onClick={() => navigate("/projects")}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateProject;
