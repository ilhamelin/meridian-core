import { useState } from 'react';

export default function ContactForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [status, setStatus] = useState('idle');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');

        // ⚠️ REEMPLAZA CON UN NUEVO WEBHOOK DE N8N PARA "CONTACTO"
        // Puedes duplicar tu flujo anterior y cambiar el nodo Google Sheets
        const WEBHOOK_URL = 'http://localhost:5678/webhook-test/contact-form';

        try {
            const response = await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    timestamp: new Date().toISOString(),
                    source: 'Contact Page'
                }),
            });

            if (!response.ok) throw new Error('Error en el envío');

            setStatus('success');
            setFormData({ name: '', email: '', message: '' });
        } catch (error) {
            console.error(error);
            setStatus('error');
            setTimeout(() => setStatus('idle'), 3000);
        }
    };

    if (status === 'success') {
        return (
            <div className="p-8 bg-green-50 border border-green-200 rounded-xl text-center animate-fade-in">
                <div className="text-4xl mb-4">✅</div>
                <h3 className="text-xl font-bold text-green-800 mb-2">Mensaje Enviado</h3>
                <p className="text-green-600">Gracias por contactarnos. Te responderemos pronto.</p>
                <button
                    onClick={() => setStatus('idle')}
                    className="mt-6 px-4 py-2 text-sm font-medium text-green-700 hover:text-green-900 underline"
                >
                    Enviar otro mensaje
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-slate-700">Nombre</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                        placeholder="Tu nombre"
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-slate-700">Email</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                        placeholder="tu@email.com"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-slate-700">Mensaje</label>
                <textarea
                    name="message"
                    id="message"
                    rows="4"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition resize-none"
                    placeholder="¿En qué podemos ayudarte?"
                ></textarea>
            </div>

            <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full py-3 px-6 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
                {status === 'submitting' ? (
                    <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Enviando...
                    </>
                ) : 'Enviar Mensaje'}
            </button>

            {status === 'error' && (
                <p className="text-center text-red-500 text-sm">Hubo un error al enviar el mensaje. Inténtalo de nuevo.</p>
            )}
        </form>
    );
}