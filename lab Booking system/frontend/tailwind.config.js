/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2a7a8e",
        secondary: "#98d2e0",
        primaryHover: "#1e5a6a", 
        secondaryHover: "#7bc4d4",
        background: "#f8fafc",
        star: "#a1ad2eff",
        starHover: "#8c9724",
        slate900: "#0F172A",
        slate700: "#334155",
        slate800: "#1e293b",
        slate100: "#f1f5f9",
        slate500: "#64748b",
        slate200: "#e2e8f0",
        gray900: "#111827",
        gray800: "#1f2937",
        gray700: "#374151",
        gray600: "#4b5563",
        gray500: "#6b7280",
        gray200: "#e5e7eb",
        gray100: "#f3f4f6",
        slate50: "#f8fafc",
        textDark: "#1e293b",
        textMuted: "#64748b",
        mint50: "#f1fcfb",
        accentBlue: "#409eb5",
        teal: "#008080",
        emerald50: "#ecfdf5",
        emerald100: "#d1fae5",
        emerald300: "#6ee7b7",
        emerald600: "#059669",
        orange50: "#fff7ed",
        orange100: "#ffedd5",
        orange600: "#ea580c",
        red50: "#fef2f2",
        red500: "#ef4444",
        red600: "#dc2626",
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.8s ease-out forwards',
      },
    },
  },
  plugins: [],
}

