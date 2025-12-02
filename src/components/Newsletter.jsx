import { useState } from 'react';

export default function Newsletter() {
    const [email, setEmail] = useState('');
    // Añadimos estado 'error' para feedback real
    const [status, setStatus] = useState('idle'); // idle, submitting, success, error

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');

        // URL de tu Webhook de Producción de n8n (Cámbiala por la real cuando la tengas)
        // TIP: Para desarrollo local usa la URL de túnel, para prod la de n8n cloud/self-hosted
        const N8N_WEBHOOK_URL = 'http://localhost:5678/webhook/newsletter-subscribe';

        try {
            const response = await fetch(N8N_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    source: 'landing-page',
                    timestamp: new Date().toISOString()
                }),
            });

            if (!response.ok) {
                throw new Error('Error en el servidor de automatización');
            }

            // Si todo va bien:
            setStatus('success');
            setEmail('');

        } catch (error) {
            console.error("Fallo al suscribir:", error);
            setStatus('error');

            // Opcional: Volver a 'idle' después de 3 segundos para permitir reintentar
            setTimeout(() => setStatus('idle'), 3000);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-1 p-6 bg-white rounded-xl shadow-lg border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Únete a la lista de espera</h3>
            <p className="text-slate-600 text-sm mb-4">Notifícame cuando Meridian Core esté listo.</p>

            {/* Renderizado Condicional basado en Estados Reales */}
            {status === 'success' ? (
                <div className="p-3 bg-green-100 text-green-700 rounded-md text-center animate-fade-in">
                    <span className="font-bold">¡Conectado!</span> Tus datos viajaron a n8n correctamente.
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <div className="flex gap-2">
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="tu@email.com"
                            className={`flex-1 px-4 py-2 border rounded-lg outline-none transition
                                ${status === 'error'
                                    ? 'border-red-300 focus:ring-2 focus:ring-red-200 bg-red-50 text-red-900'
                                    : 'border-slate-300 focus:ring-2 focus:ring-blue-500 text-slate-900'
                                }`}
                            disabled={status === 'submitting'}
                        />
                        <button
                            type="submit"
                            disabled={status === 'submitting'}
                            className="px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 disabled:opacity-70 disabled:cursor-not-allowed transition flex items-center gap-2"
                        >
                            {status === 'submitting' && (
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                            {status === 'submitting' ? 'Enviando...' : 'Enviar'}
                        </button>
                    </div>

                    {/* Mensaje de Error (Feedback de Fallo) */}
                    {status === 'error' && (
                        <p className="text-xs text-red-600 mt-1">
                            ❌ No se pudo conectar con el webhook. Revisa la consola.
                        </p>
                    )}
                </form>
            )}
        </div>
    );
}