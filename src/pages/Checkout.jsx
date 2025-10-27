import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../mobile.css";

export default function Checkout() {
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const navigate = useNavigate();

    // Cargar productos seleccionados del localStorage
    useEffect(() => {
        const storedProducts = localStorage.getItem("selectedProducts");
        if (storedProducts) {
            setSelectedProducts(JSON.parse(storedProducts));
        } else {
            navigate("/home");
        }
    }, [navigate]);

    // Calcular total
    const total = selectedProducts.reduce((acc, p) => acc + p.price, 0);

    // Confirmar pago
    const handlePayment = async () => {
        if (selectedProducts.length === 0) {
            alert("No hay productos seleccionados.");
            return;
        }

        setIsProcessing(true);

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Debes iniciar sesión nuevamente.");
                navigate("/login");
                return;
            }

            const body = {
                products: selectedProducts.map((p) => p._id), // ✅ ahora es array
                total,
            };

            const res = await fetch("https://tienda-web-backend.vercel.app/api/user/pay", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Error al procesar el pago");
            }

            alert("🎉 ¡Pago realizado con éxito!");
            localStorage.removeItem("selectedProducts");
            navigate("/home", { replace: true });
        } catch (error) {
            console.error("Error al procesar el pago:", error);
            alert("Hubo un problema al realizar el pago.");
        } finally {
            setIsProcessing(false);
        }
    };


    // Cancelar y volver al home
    const handleCancel = () => {
        navigate("/home");
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">💳 Confirmar compra</h1>

            {selectedProducts.length > 0 ? (
                <div className="w-full max-w-3xl bg-white rounded-2xl shadow-md p-6">
                    <div className="space-y-4">
                        {selectedProducts.map((product) => (
                            <div
                                key={product._id}
                                className="flex justify-between items-center border-b pb-2"
                            >
                                <span className="text-gray-800">{product.name}</span>
                                <span className="font-semibold text-gray-700">
                                    ${product.price}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between items-center mt-6 text-lg font-semibold">
                        <span>Total:</span>
                        <span className="text-blue-700">${total}</span>
                    </div>

                    <div className="flex justify-end gap-4 mt-8">
                        <button
                            onClick={handleCancel}
                            className="bg-gray-300 text-gray-800 px-5 py-2 rounded-xl hover:bg-gray-400 transition"
                            disabled={isProcessing}
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handlePayment}
                            className="bg-green-600 text-white px-5 py-2 rounded-xl hover:bg-green-700 transition"
                            disabled={isProcessing}
                        >
                            {isProcessing ? "Procesando..." : "Pagar ahora"}
                        </button>
                    </div>
                </div>
            ) : (
                <p className="text-gray-600 mt-6">No hay productos seleccionados.</p>
            )}
        </div>
    );
}
