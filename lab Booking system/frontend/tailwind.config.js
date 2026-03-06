/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '320px',    // iPhone SE
        'sm': '375px',    // iPhone 12 Pro
        'md': '414px',    // iPhone 14 Pro Max
        'lg': '768px',    // iPad Mini
        'xl': '1024px',   // iPad Air, iPad Pro
        '2xl': '1280px',  // Surface Pro 7
        '3xl': '1366px',  // Surface Duo
        '4xl': '1512px',  // iPad Pro 12.9"
        '5xl': '1920px',  // Desktop
      },
      colors: {
        // Primary brand colors
        primary: "#2a7a8e",
        secondary: "#98d2e0",
        primaryHover: "#1e5a6a", 
        secondaryHover: "#7bc4d4", 
        secondaryLight: "#98d2e0",
        
        // Background colors
        background: "#f8fafc", 
        bgPrimary: "#ffffff",
        bgSecondary: "#f0fdf4",
        bgMuted: "#f9fafb",
        
        // Text colors
        textPrimary: "#2a7a8e",
        textSecondary: "#98d2e0",
        textDark: "#1e293b", 
        textMuted: "#64748b",
        
        // Slate colors
        slate50: "#f8fafc",
        slate100: "#f1f5f9",
        slate200: "#e2e8f0",
        slate500: "#64748b", 
        slate700: "#334155",
        slate800: "#1e293b",
        slate900: "#0F172A",
        
        // Gray colors
        gray50: "#f9fafb",
        gray100: "#f3f4f6",
        gray200: "#e5e7eb",
        gray400: "#9ca3af",
        gray500: "#6b7280",
        gray600: "#4b5563",
        gray700: "#374151",
        gray800: "#1f2937",
        gray900: "#111827",
        
        // Status colors
        star: "#a1ad2eff",
        starHover: "#8c9724",
        teal: "#008080",
        teal600: "#0d9488",
        
        // Green colors
        emerald50: "#ecfdf5",
        emerald100: "#d1fae5",
        emerald300: "#6ee7b7",
        emerald600: "#059669",
        green50: "#f0fdf4",
        green600: "#16a34a",
        
        // Orange colors
        orange50: "#fff7ed",
        orange100: "#ffedd5",
        orange600: "#ea580c",
        amber400: "#fbbf24",
        
        // Red colors
        red50: "#fef2f2",
        red500: "#ef4444",
        red600: "#dc2626",
        
        // Yellow colors
        yellow50: "#fefce8",
        yellow600: "#ca8a04",
        
        // Accent colors
        accentBlue: "#409eb5",
        mint50: "#f1fcfb",
        
        // Base colors
        white: "#ffffff",
        black: "#000000",
        
        // Success theme from image
        success: "#16a34a",
        successLight: "#22c55e",
        successBg: "#f0fdf4",
        successBorder: "#bbf7d0",
        
        // Button colors
        btnPrimary: "#16a34a",
        btnPrimaryHover: "#15803d", 
        btnSecondary: "#e5e7eb",
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

