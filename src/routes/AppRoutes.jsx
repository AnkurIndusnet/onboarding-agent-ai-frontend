import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import Chatbot from "../pages/Chatbot/Chatbot";
import Checklist from "../pages/Checklist/Checklist";
import Documents from "../pages/Documents/Documents";
import Progress from "../pages/Progress/Progress";
import HrPanel from "../pages/HrPanel/HrPanel";
import SetPasswordPage from "../pages/Login/SetPasswordPage";

const PrivateRoute = ({ children }) => {
  const user = localStorage.getItem("token");
  return user ? children : <Navigate to="/" />;
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/set-password" element={<SetPasswordPage />} />


        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Navbar />
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/chatbot"
          element={
            <PrivateRoute>
              <Navbar />
              <Chatbot />
            </PrivateRoute>
          }
        />

        <Route
          path="/checklist"
          element={
            <PrivateRoute>
              <Navbar />
              <Checklist />
            </PrivateRoute>
          }
        />

        <Route
          path="/documents"
          element={
            <PrivateRoute>
              <Navbar />
              <Documents />
            </PrivateRoute>
          }
        />

        <Route
          path="/progress"
          element={
            <PrivateRoute>
              <Navbar />
              <Progress />
            </PrivateRoute>
          }
        />

        <Route
          path="/hr"
          element={
            <PrivateRoute>
              <Navbar />
              <HrPanel />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
