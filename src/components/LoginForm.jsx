import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../mobile.css";

export default function LoginForm() {
    const [isRegister, setIsRegister] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const endpoint = isRegister
            ? "https://tienda-web-backend.vercel.app/api/user/register"
            : "https://tienda-web-backend.vercel.app/api/user/login";

        const body = isRegister ? { name, email, password } : { email, password };

        try {
            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "Error al procesar la solicitud");
                return;
            }

            if (isRegister) {
                alert("✅ Registro exitoso, ahora inicia sesión.");
                setIsRegister(false);
                setName("");
                setPassword("");
            } else {
                localStorage.setItem("token", data.token);
                localStorage.setItem("userEmail", email);
                navigate("/home");
            }
        } catch (error) {
            console.error("Error en autenticación:", error);
            alert("Error al conectar con el servidor.");
        }
    };

    return (
        <div className="container h-screen flex flex-col justify-center items-center bg-gradient-to-b from-blue-50 to-blue-200 px-6">
            <h1 className="text-3xl font-extrabold text-blue-700 mb-8 tracking-tight text-center">
                Inicia Sesion
            </h1>

            <form
                onSubmit={handleSubmit}
                className="bg-white w-full max-w-xs p-6 rounded-3xl shadow-lg flex flex-col gap-4"
            >
                {isRegister && (
                    <input
                        type="text"
                        placeholder="Nombre completo"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="p-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                        required
                    />
                )}
                <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="p-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                    required
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="p-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                    required
                />

                <button
                    type="submit"
                    className="bg-blue-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-blue-700 active:scale-95 transition"
                >
                    {isRegister ? "Registrarse" : "Iniciar Sesión"}
                </button>
            </form>

            <button
                onClick={() => setIsRegister(!isRegister)}
                className="text-blue-700 mt-6 text-sm font-medium hover:underline"
            >
                {isRegister
                    ? "¿Ya tienes cuenta? Inicia sesión"
                    : "¿No tienes cuenta? Regístrate"}
            </button>
        </div>
    );
}
