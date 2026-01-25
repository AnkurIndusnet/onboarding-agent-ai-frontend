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
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <GoogleLogin onSuccess={onSuccess} onError={() => alert("Login Failed")} />
    </div>
  );
};

export default LoginPage;
