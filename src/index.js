import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ThemeProvider>
  <GoogleOAuthProvider clientId="813701072224-v8paocil9ovfaf0j93tqkioe9efr13k2.apps.googleusercontent.com">
<AuthProvider>
      <App />
    </AuthProvider> 
     </GoogleOAuthProvider>
     </ThemeProvider>
      
);
