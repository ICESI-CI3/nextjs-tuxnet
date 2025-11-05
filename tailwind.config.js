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
        // 🎨 Paleta BellezaTotal
        primary: '#E85D75',     // Rosa principal (botones, acentos)
        secondary: '#FCE4EC',   // Rosa claro (fondos suaves)
        background: '#FFF8F9',  // Fondo general cálido
        text: '#333333',        // Texto principal
        accent: '#D6A75D',      // Dorado suave (detalles premium)
        neutral: '#F5F5F5',     // Fondo secundario o tarjetas
        success: '#6EE7B7',     // Verde menta (mensajes positivos)
        error: '#EF4444',       // Rojo coral (errores)
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'], // Fuente moderna y limpia
      },
    },
  },
  plugins: [],
};
