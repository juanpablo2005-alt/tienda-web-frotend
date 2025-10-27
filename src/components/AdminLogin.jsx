import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    // Si ya está logueado, no debe volver a /admin-login
    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        if (token) navigate("/admin", { replace: true });
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("https://tienda-web-backend.vercel.app/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "Credenciales incorrectas");
                return;
            }

            // Guardar token y usuario en localStorage
            localStorage.setItem("adminToken", data.token);
            localStorage.setItem("adminUsername", username);

            // Redirigir al panel de administración
            navigate("/admin", { replace: true });
        } catch (error) {
            console.error("Error al iniciar sesión como admin:", error);
            alert("Error de conexión con el servidor");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h2 className="text-2xl font-bold mb-6">Inicio de Sesión - Administrador</h2>

            <form
                onSubmit={handleLogin}
                className="bg-white p-6 rounded-2xl shadow-md w-80 flex flex-col gap-4"
            >
                <input
                    type="text"
                    placeholder="Nombre de usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="border p-2 rounded"
                    required
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border p-2 rounded"
                    required
                />
                <button
                    type="submit"
                    className="bg-green-600 text-white rounded p-2 hover:bg-green-700"
                >
                    Iniciar Sesión
                </button>
            </form>
        </div>
    );
}
