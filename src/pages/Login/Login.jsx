import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  // demo login user
  const demoUser = {
    name: "Amit Sharma",
    role: "HR"
  };

  const handleLogin = () => {
    // store user (temporary auth)
    localStorage.setItem("user", JSON.stringify(demoUser));
    navigate("/dashboard");
  };

  return (
    <div className="login-container">
      <h2>Onboarding Portal</h2>

      <input placeholder="Email" />
      <input placeholder="Password" type="password" />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
