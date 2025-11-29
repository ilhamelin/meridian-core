import { useState, useEffect } from 'react';

export default function TablaCorreos() {
    const [correos, setCorreos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // Nuevo estado para errores

    useEffect(() => {
        const API_URL = 'http://localhost:5678/webhook/correos';

        fetch(API_URL)
            .then((response) => {
                if (!response.ok) throw new Error("Error en la conexión con n8n");
                return response.json();
            })
            .then((data) => {
                // Validación extra: asegurarse de que sea un array
                if (Array.isArray(data)) {
                    setCorreos(data);
                } else {
                    setCorreos([]); // Evita que .map rompa la app
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error:", error);
                setError(true); // Activamos estado de error
                setLoading(false);
            });
    }, []);

    if (loading) return (
        <div className="text-center p-8 animate-pulse text-gray-500">
            📡 Conectando con n8n webhook...
        </div>
    );

    // Nuevo UI para Error
    if (error) return (
        <div className="p-4 max-w-4xl mx-auto bg-red-50 border border-red-200 rounded-lg text-center">
            <p className="text-red-600 font-medium">⚠️ No se pudo conectar con el flujo de automatización.</p>
            <p className="text-xs text-red-400 mt-1">Asegúrate de que el túnel de n8n esté activo.</p>
        </div>
    );

    // Nuevo UI para "Sin Datos"
    if (correos.length === 0) return (
        <div className="p-4 max-w-4xl mx-auto text-center border-2 border-dashed border-gray-200 rounded-lg py-12">
            <p className="text-gray-400">📭 La bandeja inteligente está vacía por ahora.</p>
        </div>
    );

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">📧 Mi Bandeja Inteligente</h2>
            <div className="overflow-x-auto shadow-md rounded-lg">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-3">Fecha</th>
                            <th className="px-6 py-3">Asunto</th>
                            <th className="px-6 py-3">Categoría</th>
                            <th className="px-6 py-3">Resumen IA</th>
                        </tr>
                    </thead>
                    <tbody>
                        {correos.map((correo, index) => (
                            <tr key={index} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4">{correo.Fecha}</td>
                                <td className="px-6 py-4 font-medium text-gray-900">{correo.Asunto}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${correo['Categoría'] === 'URGENTE' ? 'bg-red-100 text-red-800' :
                                        correo['Categoría'] === 'TRABAJO' ? 'bg-blue-100 text-blue-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                        {correo['Categoría'] || 'General'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">{correo.Snippet}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}