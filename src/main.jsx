import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ShopProvider } from "./Components/shopcontex.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

const ClientId = "816123198443-2ahvp9a7k26l0o9ru8hvmc9r6qmi4kla.apps.googleusercontent.com"

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ShopProvider>
      <GoogleOAuthProvider clientId={ClientId}>
      <App />
      </GoogleOAuthProvider>
    </ShopProvider>
  </React.StrictMode>
);
