/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta derivada del logo BSPapeleria (4 franjas)
        primary:   '#98acf8',   // Azul Medio (color principal - mejor contraste)
        secondary: '#b088f9',   // Púrpura (hover states)
        accent:    '#da9ff9',  // Lila/Rosa (acentos)
        cream:     '#bedcfa', // Azul Claro (fondo suave)
        sand:      '#e0d4fc', // Lavanda suave (bordes)
        dark:      '#1a1a2e', // Casi negro (textos)
        
        // Variantes derivadas para estados semánticos
        'primary-light': '#d4dffa',  // Azul muy claro
        'primary-dark': '#7a8fda',  // Azul más oscuro
        'secondary-light': '#cca5fc', // Púrpura claro
        
        // Estados semánticos (basados en la paleta)
        success: '#8ed4a8',  // Verde suave basado en la paleta
        'success-bg': '#d4f0dd',
        error:   '#e8a8b8',  // Rosa/Rojizo suave
        'error-bg': '#fce4e8',
        warning: '#f0d4a8', // Amarillo/naranja suave
        'warning-bg': '#fcf4e0',
      },
      fontFamily: {
        heading: ["'Montserrat'", 'sans-serif'],
        body:    ["'Inter'", 'sans-serif'],
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(-8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px) rotate(-2deg)' },
          '50%':       { transform: 'translateY(-10px) rotate(2deg)' },
        },
        'twinkle': {
          '0%, 100%': { opacity: '0.3', transform: 'scale(0.8)' },
          '50%':       { opacity: '1',   transform: 'scale(1.2)' },
        },
        'bounce-once': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':       { transform: 'translateY(-4px)' },
        },
      },
      animation: {
        'fade-in':    'fade-in 0.2s ease-out both',
        'float':      'float 4s ease-in-out infinite',
        'twinkle':    'twinkle 2s ease-in-out infinite',
        'bounce-once':'bounce-once 0.4s ease-in-out 1',
      },
    },
  },
  plugins: [],
}
