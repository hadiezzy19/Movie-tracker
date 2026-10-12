import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

function Register() {
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e) {
    e.preventDefault();
    setErrorMessage("");

    const formData = new FormData(e.target);
    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      await authService.register(username, email, password);
      navigate("/");
    } catch (error) {
      setErrorMessage(error?.response?.data || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">🎬</div>
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Start tracking your movie journey</p>

        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label className="form-label auth-label">Username</label>
            <input
              type="text"
              className="form-control custom-input"
              placeholder="Choose a username"
              name="username"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label auth-label">Email</label>
            <input
              type="email"
              className="form-control custom-input"
              placeholder="your@email.com"
              name="email"
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label auth-label">Password</label>
            <input
              type="password"
              className="form-control custom-input"
              placeholder="At least 8 characters"
              name="password"
              required
            />
          </div>

          <button className="btn custom-btn w-100" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </button>

          {errorMessage && (
            <div className="alert alert-danger mt-3 mb-0 auth-error">
              {errorMessage}
            </div>
          )}
        </form>

        <p className="auth-footer-text">
          Already have an account?{" "}
          <Link to="/" className="auth-link">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
