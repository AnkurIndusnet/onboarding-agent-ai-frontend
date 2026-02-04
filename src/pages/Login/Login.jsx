import "./Login.css";
import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "../../common/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { fetchMe } = useAuth();

  const onSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post("/auth/google-login", {
        token: credentialResponse.credential,
      });

      localStorage.setItem("token", res.data.token);
      await fetchMe();

      if (res.data.passwordRequired) {
        navigate("/set-password");
      } else {
        navigate("/dashboard");
      }
    } catch {
      alert("Login failed");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Welcome To INT Family.👋</h1>
        <p className="subtitle">
          Sign in to continue your onboarding
        </p>

        <div className="google-wrapper">
          <GoogleLogin
            onSuccess={onSuccess}
            onError={() => alert("Login Failed")}
            useOneTap
          />
        </div>

        <p className="login-footer">
          Secure login powered by Google
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
