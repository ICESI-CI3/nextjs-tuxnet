/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',   // Azul brillante
        secondary: '#F472B6', // Rosa suave
        background: '#F9FAFB', // Fondo claro
        text: '#1F2937',      // Gris oscuro (texto principal)
        success: '#10B981',   // Verde menta
      },
    },
  },
  plugins: [],
};
