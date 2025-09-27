import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AuthProvider from "./contexts/AuthProvider";
import { RouterProvider } from "react-router";
import router from "./routes/routes.jsx";
import { ThemeProvider } from "./contexts/ThemeContext.jsx";
// import App from './App.jsx'
// import ThemeProvider from "./contexts/ThemeContext";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>
);
