import React, { useState } from "react";
import axios from "../../common/api";
import { useNavigate } from "react-router-dom";
import "./SetPassword.css";
import { useAuth } from "../../context/AuthContext";

const SetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const navigate = useNavigate();
  const { fetchMe } = useAuth();

  const submitPassword = async () => {
    if (password !== confirm) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post("/auth/set-password", { password });
      localStorage.setItem("token", res.data.token);
      await fetchMe();
      navigate("/dashboard");
    } catch {
      alert("Failed to set password");
    }
  };

  return (
    <div className="setpwd-container">
      <div className="setpwd-card">
        <h2>Set Your Password</h2>
        <p>This is required only once.</p>

        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        <button onClick={submitPassword}>Save & Continue</button>
      </div>
    </div>
  );
};

export default SetPasswordPage;
