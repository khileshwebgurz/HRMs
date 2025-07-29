import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import "../../assets/css/logincss.css";

const ResetPasswordForm = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/reset-password`, {
        email,
        token,
        password,
        password_confirmation: confirmPassword,
      });

      setMessage(response.data.message);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      setMessage("");
    }
  };

  return (
      <div className="login-page">
    <div className="login-box">
      <div className="card card-outline card-primary">
        <div className="card-header text-center">
          <h3>Reset Your Password</h3>
        </div>
        <div className="card-body">
          {message && <div className="alert alert-success">{message}</div>}
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-info btn-block">
              Reset Password
            </button>
          </form>
           <p className="mt-3 mb-1">
            <Link to="/">Back to Login</Link>
          </p>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ResetPasswordForm;
