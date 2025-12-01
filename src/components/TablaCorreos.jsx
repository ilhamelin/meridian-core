import { useState, useEffect } from 'react';

export default function TablaCorreos() {
    const [correos, setCorreos] = useState([]);
    const [loading, setLoading] = useState(true); // Carga inicial
    const [refreshing, setRefreshing] = useState(false); // Re-carga manual
    const [error, setError] = useState(null);
    const [fechaFiltro, setFechaFiltro] = useState('');

    // Función reutilizable para cargar datos
    const cargarDatos = async (esRecargaManual = false) => {
        if (esRecargaManual) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }
        setError(null);

        // URL de tu Webhook (Asegúrate de que sea la correcta, local o producción)
        const API_URL = 'http://localhost:5678/webhook/correos';

        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error("Error en la conexión con n8n");

            const data = await response.json();

            if (Array.isArray(data)) {
                setCorreos(data);
            } else {
                setCorreos([]);
            }
        } catch (error) {
            console.error("Error:", error);
            setError(true);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Carga inicial al montar el componente
    useEffect(() => {
        cargarDatos();
    }, []);

    // Lógica de Filtrado
    const correosFiltrados = correos.filter((correo) => {
        if (!fechaFiltro) return true;
        const [year, month, day] = fechaFiltro.split('-');
        const fechaBuscada = `${day}/${month}/${year}`;
        return correo.Fecha && correo.Fecha.startsWith(fechaBuscada);
    });

    // Renderizado de Estado de Carga Inicial
    if (loading) return (
        <div className="text-center p-8 animate-pulse text-gray-500">
            📡 Conectando con n8n webhook...
        </div>
    );

    // Renderizado de Error
    if (error) return (
        <div className="p-4 max-w-4xl mx-auto bg-red-50 border border-red-200 rounded-lg text-center">
            <p className="text-red-600 font-medium">⚠️ Error de conexión.</p>
            <button
                onClick={() => cargarDatos()}
                className="mt-2 text-sm text-red-700 underline hover:text-red-900"
            >
                Reintentar conexión
            </button>
        </div>
    );

    return (
        <div className="p-4 max-w-4xl mx-auto">
            {/* Header con Título, Filtro y Botón de Recarga */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold text-slate-800">📧 Mi Bandeja Inteligente</h2>

                    {/* Botón de Actualizar (Refresh) */}
                    <button
                        onClick={() => cargarDatos(true)}
                        disabled={refreshing}
                        className={`p-2 rounded-full hover:bg-slate-100 transition-all border border-slate-200 shadow-sm
                            ${refreshing ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}
                        `}
                        title="Actualizar tabla"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={`text-slate-600 ${refreshing ? 'animate-spin' : ''}`}
                        >
                            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                            <path d="M21 3v5h-5" />
                            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                            <path d="M8 16H3v5" />
                        </svg>
                    </button>
                </div>

                {/* Input de Fecha */}
                <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
                    <label htmlFor="date-filter" className="text-sm font-medium text-slate-500">📅</label>
                    <input
                        type="date"
                        id="date-filter"
                        value={fechaFiltro}
                        onChange={(e) => setFechaFiltro(e.target.value)}
                        className="outline-none text-slate-700 text-sm font-mono cursor-pointer bg-transparent"
                    />
                    {fechaFiltro && (
                        <button
                            onClick={() => setFechaFiltro('')}
                            className="text-xs text-red-500 hover:text-red-700 font-bold px-2"
                        >✕</button>
                    )}
                </div>
            </div>

            {/* Tabla de Datos */}
            <div className={`overflow-x-auto shadow-md rounded-lg border border-slate-100 transition-opacity duration-300 ${refreshing ? 'opacity-50' : 'opacity-100'}`}>
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
                        {correosFiltrados.length > 0 ? (
                            correosFiltrados.map((correo, index) => (
                                <tr key={index} className="bg-white border-b hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 whitespace-nowrap font-mono text-xs">{correo.Fecha}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{correo.Asunto}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold border ${correo['Categoría']?.includes('URGENTE') ? 'bg-red-50 text-red-700 border-red-100' :
                                            correo['Categoría']?.includes('TRABAJO') ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                'bg-gray-50 text-gray-600 border-gray-100'
                                            }`}>
                                            {correo['Categoría'] || 'General'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-xs leading-relaxed">{correo.Snippet}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="px-6 py-12 text-center text-gray-400">
                                    {fechaFiltro
                                        ? "🔍 No hay correos en esta fecha (revisa el historial)."
                                        : "📭 Bandeja vacía."}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-2 flex justify-end items-center gap-2 text-xs text-slate-400">
                {refreshing ? <span>Actualizando...</span> : <span>Sincronizado</span>}
                <span>•</span>
                <span>Mostrando {correosFiltrados.length} items</span>
            </div>
        </div>
    );
}