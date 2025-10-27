import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../mobile.css";

export default function Home() {
    const [products, setProducts] = useState([]);
    const [selected, setSelected] = useState([]);
    const navigate = useNavigate();

    // Obtener productos
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch("https://tienda-web-backend.vercel.app/api/products");
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || "Error al obtener productos");
                setProducts(data);
            } catch (error) {
                console.error("Error:", error);
                alert("No se pudieron cargar los productos.");
            }
        };
        fetchProducts();
    }, []);

    // Agregar o quitar producto
    const toggleProduct = (product) => {
        setSelected((prev) =>
            prev.some((p) => p._id === product._id)
                ? prev.filter((p) => p._id !== product._id)
                : [...prev, product]
        );
    };

    // Cerrar sesión
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userEmail");
        navigate("/login", { replace: true });
    };

    // Ir a checkout
    const goToCheckout = () => {
        if (selected.length === 0) {
            alert("Selecciona al menos un producto.");
            return;
        }
        localStorage.setItem("selectedProducts", JSON.stringify(selected));
        navigate("/checkout");
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center px-4 pb-20">
            {/* Header */}
            <header className="flex justify-between items-center w-full py-4 border-b">
                <h1 className="text-lg font-bold text-blue-600">🏪 Tienda Virtual</h1>
                <button
                    onClick={handleLogout}
                    className="text-sm text-red-500 font-semibold"
                >
                    Cerrar sesión
                </button>
            </header>

            {/* Lista de productos */}
            <div className="products-grid w-full flex flex-col gap-4 mt-6">
                {products.length > 0 ? (
                    products.map((product) => {
                        const isSelected = selected.some((p) => p._id === product._id);
                        return (
                            <div
                                key={product._id}
                                className={`border rounded-2xl p-4 shadow-sm flex flex-col items-center justify-between ${isSelected ? "border-blue-500" : "border-gray-200"
                                    }`}
                            >
                                <h2 className="text-lg font-semibold text-gray-800">
                                    {product.name}
                                </h2>
                                <p className="text-gray-600 text-base mb-3">
                                    💲{product.price}
                                </p>
                                <button
                                    onClick={() => toggleProduct(product)}
                                    className={`w-full py-2 rounded-xl font-semibold ${isSelected
                                        ? "bg-gray-300 text-gray-700"
                                        : "bg-blue-600 text-white hover:bg-blue-700"
                                        }`}
                                >
                                    {isSelected ? "Quitarlo" : "Lo quiero"}
                                </button>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-gray-600 text-center w-full mt-8">
                        No hay productos disponibles.
                    </p>
                )}
            </div>

            {/* Botón de ir al pago */}
            <div className="fixed bottom-4 w-[90%] max-w-sm">
                <button
                    onClick={goToCheckout}
                    className="w-full bg-green-600 text-white py-3 rounded-2xl font-bold text-lg hover:bg-green-700"
                >
                    Ir al pago ({selected.length})
                </button>
            </div>
        </div>
    );
}