import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../../assets/css/logincss.css";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/forgot-password`, {
        email,
      });

      setMessage(response.data.message);
      setError("");
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong.");
      setMessage("");
    }
  };

  return (
      <div className="login-page">
    <div className="login-box">
      <div className="card card-outline card-primary">
        <div className="card-header text-center">
          <h3>Send Password Reset Link</h3>
        </div>
        <div className="card-body">
          {message && <div className="alert alert-success">{message}</div>}
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="input-group mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Enter Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="input-group-append">
                <div className="input-group-text">
                  <span className="fas fa-envelope"></span>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12 text-center">
                <button type="submit" className="btn btn-info btn-block">
                  Send
                </button>
              </div>
            </div>
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

export default ForgotPasswordForm;
