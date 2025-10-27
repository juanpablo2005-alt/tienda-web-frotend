import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../admin.css";


export default function AdminPanel() {
    const [products, setProducts] = useState([]);
    const [dashboard, setDashboard] = useState({ totalVentas: 0, ventasPorUsuario: [] }); // Dashboard
    const [form, setForm] = useState({ name: "", price: "", available: true });
    const [editingId, setEditingId] = useState(null);
    const navigate = useNavigate();
    const adminToken = localStorage.getItem("adminToken");

    // Obtener productos y datos del dashboard
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Productos
                const resProd = await fetch("https://tienda-web-backend.vercel.app/api/admin/products", {
                    headers: { Authorization: `Bearer ${adminToken}` },
                });

                if (resProd.status === 401) {
                    localStorage.removeItem("adminToken");
                    localStorage.removeItem("adminUsername");
                    navigate("/admin-login", { replace: true });
                    return;
                }

                const dataProd = await resProd.json();
                setProducts(dataProd);

                // Dashboard (ventas totales y por usuario)
                const resDash = await fetch("https://tienda-web-backend.vercel.app/api/admin/dashboard", {
                    headers: { Authorization: `Bearer ${adminToken}` },
                });

                const dataDash = await resDash.json();
                setDashboard(dataDash);
            } catch (error) {
                console.error("Error al obtener datos del admin:", error);
            }
        };

        if (adminToken) fetchData();
    }, [adminToken, navigate]);

    // Manejador del formulario
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    };

    // Crear o actualizar producto
    const handleSubmit = async () => {
        try {
            const url = editingId
                ? `https://tienda-web-backend.vercel.app/api/admin/products/${editingId}`
                : "https://tienda-web-backend.vercel.app/api/admin/products";

            const method = editingId ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${adminToken}`,
                },
                body: JSON.stringify(form),
            });

            if (!res.ok) throw new Error("Error al guardar producto");

            const data = await res.json();

            if (editingId) {
                setProducts((prev) =>
                    prev.map((p) => (p._id === editingId ? data.product : p))
                );
                setEditingId(null);
            } else {
                setProducts([...products, data.product]);
            }

            setForm({ name: "", price: "", available: true });
        } catch (error) {
            console.error(error.message);
        }
    };

    // Eliminar producto
    const handleDelete = async (id) => {
        try {
            await fetch(`https://tienda-web-backend.vercel.app/api/admin/products/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${adminToken}` },
            });
            setProducts(products.filter((p) => p._id !== id));
        } catch (error) {
            console.error("Error al eliminar producto:", error);
        }
    };

    // Editar producto
    const handleEdit = (product) => {
        setEditingId(product._id);
        setForm({
            name: product.name,
            price: product.price,
            available: product.available,
        });
    };

    // Cerrar sesión
    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUsername");
        navigate("/admin-login", { replace: true });
    };

    return (
        <div className="admin-container">
            <h1>Panel de Administración</h1>
            <button className="logout-btn" onClick={handleLogout}>Cerrar sesión</button>

            <div className="dashboard">
                <h2>📊 Resumen de Ventas</h2>
                <p>Total vendido: 💲{dashboard.totalVentas}</p>
                <div className="scroll-section">
                    {dashboard.ventasPorUsuario.map(u => (
                        <div className="sale-card" key={u.userId}>
                            <strong>👤 Usuario:</strong> {u.nombre} <br />
                            <strong>📧 Correo:</strong> {u.email} <br />
                            <strong>💰 Total vendido:</strong> ${u.total}
                        </div>
                    ))}
                </div>
            </div>

            {/* Sección de creación/edición */}
            <h2>{editingId ? "Editar producto" : "Crear producto"}</h2>
            <div className="admin-form">
                <input type="text" name="name" placeholder="Nombre" value={form.name} onChange={handleChange} />
                <input type="number" name="price" placeholder="Precio" value={form.price} onChange={handleChange} />
                <label>Disponible:
                    <input type="checkbox" name="available" checked={form.available} onChange={handleChange} />
                </label>
                <button className="submit-btn" onClick={handleSubmit}>{editingId ? "Actualizar" : "Crear"}</button>
                {editingId && <button className="cancel-btn" onClick={() => { setEditingId(null); setForm({ name: "", price: "", available: true }); }}>Cancelar</button>}
            </div>

            <h2>Lista de productos</h2>
            <div className="scroll-section">
                {products.map(p => (
                    <div className="product-card" key={p._id}>
                        <h3>{p.name}</h3>
                        <p>💲{p.price}</p>
                        <p>{p.available ? "Disponible" : "No disponible"}</p>
                        <button className="edit-btn" onClick={() => handleEdit(p)}>Editar</button>
                        <button className="delete-btn" onClick={() => handleDelete(p._id)}>Eliminar</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

