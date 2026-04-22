import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },
        ocean: {
          50: "#f0f7ff",
          100: "#dceeff",
          200: "#b9ddff",
          300: "#85c6ff",
          400: "#4aa7ff",
          500: "#1E90FF",
          600: "#0f71d0",
          700: "#145aa3",
          800: "#164b85",
          900: "#173f6d"
        },
        midnight: {
          950: "#0A1628"
        }
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at top left, rgba(30,144,255,0.2), transparent 35%), radial-gradient(circle at bottom right, rgba(23,63,109,0.15), transparent 40%)"
      },
      boxShadow: {
        soft: "0 10px 26px rgba(15, 23, 42, 0.07)",
        panel: "0 8px 24px rgba(10, 22, 40, 0.14)",
        glow: "0 0 0 1px rgba(30, 144, 255, 0.16), 0 10px 28px rgba(30, 144, 255, 0.16)"
      },
      borderRadius: {
        xl2: "1.125rem",
        "2xl": "1rem"
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        display: ["var(--font-display)"]
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" }
        }
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both"
      }
    }
  },
  plugins: []
};

export default config;
