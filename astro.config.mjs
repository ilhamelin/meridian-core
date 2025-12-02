// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react"; //

// https://astro.build/config
export default defineConfig({
    site: 'https://meridiancore.dev',


    vite: {
        plugins: [tailwindcss()],
        server: {
            // Esto permite que el túnel de Cloudflare acceda a tu PC
            allowedHosts: true,
        }
    },
    integrations: [
        react() // <--- ¿ESTA FUNCIÓN ESTÁ AQUÍ?
    ]
});
