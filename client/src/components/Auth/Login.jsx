import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/css/logincss.css";
import { Link } from "react-router-dom";
import axios from "axios";
const Login = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send login request
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/login`,
        { email, password },
        {
          withCredentials: true,
        }
      );

      navigate("/employee/dashboard");
    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);
      setErrors(error.response?.data || error.message);
    }
  };
  
  return (
    <div className="login-page">
      <div className="login-box">
        <div className="card card-outline card-primary">
          <div className="card-header text-center">
            <Link to="#">
              <img
                src="/dist/img/logo.png"
                alt="AdminLTE Logo"
                className="brand-image wgz_full_logo"
                style={{ opacity: 0.8 }}
              />
            </Link>
          </div>
          <div className="card-body">
            <p className="login-box-msg">Login</p>

            <form onSubmit={handleSubmit}>
              <div className="input-group mb-3">
                <input
                  id="email"
                  type="email"
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="E-Mail Address"
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-envelope"></span>
                  </div>
                </div>
                {errors.email && (
                  <span className="invalid-feedback" role="alert">
                    <strong>{errors.email}</strong>
                  </span>
                )}
              </div>

              <div className="input-group mb-3">
                <input
                  id="password"
                  type="password"
                  className={`form-control ${
                    errors.password ? "is-invalid" : ""
                  }`}
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Password"
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-lock"></span>
                  </div>
                </div>
                {errors.password && (
                  <span className="invalid-feedback" role="alert">
                    <strong>{errors.password}</strong>
                  </span>
                )}
              </div>

              <div className="row">
                <div className="col-8">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="remember"
                      checked={remember}
                      onChange={() => setRemember(!remember)}
                    />
                    <label className="form-check-label" htmlFor="remember">
                      Remember Me
                    </label>
                  </div>
                </div>
                <div className="col-4">
                  <button type="submit" className="btn btn-primary btn-block">
                    Login
                  </button>
                </div>
              </div>
            </form>

            <p className="mb-1">
              <a href="/forgot-password">I forgot my password</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
