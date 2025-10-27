import React from "react";
import { Navigate } from "react-router-dom";

/**
 * Si token existe redirige al home, sino renderiza children (página pública).
 * Útil para /login y /admin-login.
 */
export default function PublicRoute({ children, admin = false }) {
    const token = admin ? localStorage.getItem("adminToken") : localStorage.getItem("token");
    if (token) {
        return <Navigate to={admin ? "/admin" : "/home"} replace />;
    }
    return children;
}
