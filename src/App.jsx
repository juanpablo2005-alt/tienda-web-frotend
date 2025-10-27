import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import AdminLogin from "./components/AdminLogin";
import Home from "./pages/Home";
import Checkout from "./pages/Checkout";
import AdminPanel from "./pages/AdminPanel";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import PublicRoute from "./components/PublicRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* raíz -> ir a /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Páginas públicas, bloqueadas si ya estás logueado */}
        <Route path="/login" element={<PublicRoute><LoginForm /></PublicRoute>} />
        <Route path="/admin-login" element={<PublicRoute admin={true}><AdminLogin /></PublicRoute>} />

        {/* Rutas protegidas de usuario */}
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />

        {/* Rutas protegidas de admin */}
        <Route path="/admin" element={<AdminProtectedRoute><AdminPanel /></AdminProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
