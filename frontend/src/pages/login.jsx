import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        showMessage("❌ Invalid credentials", "danger");
        return;
      }

      const data = await res.json();
      localStorage.setItem("token", data.token);
      showMessage("✅ Login successful!", "success");
      setTimeout(() => navigate("/projects"), 1500);
    } catch (err) {
      showMessage("⚠️ Error during login", "danger");
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
      <div className="container" style={{ maxWidth: 420 }}>
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
            🔐 Login
          </h2>

          {message && (
            <div className={`alert alert-${message.type} text-center`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="email"
                placeholder="Email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <input
                type="password"
                placeholder="Password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-100 mb-2">
              Login
            </button>

            <button
              type="button"
              className="btn btn-outline-secondary w-100"
              onClick={() => navigate("/register")}
            >
              Sign up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;