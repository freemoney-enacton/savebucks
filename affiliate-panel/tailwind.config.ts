import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./utils/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "var(--radius-xs)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
        "3xl": "var(--radius-3xl)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        // Custom colors from your CSS variables
        brand: {
          50: "#fff3fb",
          100: "#fce7f3",
          200: "#fbcfe8",
          300: "#f9a8d4",
          400: "#f472b6",
          500: "#B50A7B",
          600: "#9d174d",
          700: "#831843",
          800: "#701a75",
          950: "#4a044e",
        },
        "blue-light": {
          50: "var(--color-blue-light-50)",
          500: "var(--color-blue-light-500)",
          600: "var(--color-blue-light-600)",
        },
        success: {
          50: "var(--color-success-50)",
          300: "var(--color-success-300)",
          500: "var(--color-success-500)",
          600: "var(--color-success-600)",
          700: "var(--color-success-700)",
          800: "var(--color-success-800)",
        },
        error: {
          50: "var(--color-error-50)",
          300: "var(--color-error-300)",
          400: "var(--color-error-400)",
          500: "var(--color-error-500)",
          600: "var(--color-error-600)",
          700: "var(--color-error-700)",
          800: "var(--color-error-800)",
        },
        warning: {
          50: "var(--color-warning-50)",
          400: "var(--color-warning-400)",
          500: "var(--color-warning-500)",
          600: "var(--color-warning-600)",
          700: "var(--color-warning-700)",
        },
        "theme-pink": {
          500: "var(--color-theme-pink-500)",
        },
        "theme-purple": {
          500: "var(--color-theme-purple-500)",
        },
        black: "var(--color-black)",
        white: "var(--color-white)",
      },
      fontSize: {
        "title-2xl": [
          "var(--text-title-2xl)",
          "var(--text-title-2xl--line-height)",
        ],
        "title-xl": [
          "var(--text-title-xl)",
          "var(--text-title-xl--line-height)",
        ],
        "title-lg": [
          "var(--text-title-lg)",
          "var(--text-title-lg--line-height)",
        ],
        "title-md": [
          "var(--text-title-md)",
          "var(--text-title-md--line-height)",
        ],
        "title-sm": [
          "var(--text-title-sm)",
          "var(--text-title-sm--line-height)",
        ],
        "title-xs": [
          "var(--text-title-xs)",
          "var(--text-title-xs--line-height)",
        ],
        "theme-xl": [
          "var(--text-theme-xl)",
          "var(--text-theme-xl--line-height)",
        ],
        "theme-sm": [
          "var(--text-theme-sm)",
          "var(--text-theme-sm--line-height)",
        ],
        "theme-xs": [
          "var(--text-theme-xs)",
          "var(--text-theme-xs--line-height)",
        ],
      },
      fontFamily: {
        outfit: "var(--font-outfit)",
      },
      fontWeight: {
        normal: "var(--font-weight-normal)",
        medium: "var(--font-weight-medium)",
        semibold: "var(--font-weight-semibold)",
        bold: "var(--font-weight-bold)",
      },
      spacing: {
        unit: "var(--spacing)",
      },
      maxWidth: {
        xs: "var(--container-xs)",
        md: "var(--container-md)",
      },
      dropShadow: {
        "2xl": "var(--drop-shadow-2xl)",
        "4xl": "var(--drop-shadow-4xl)",
      },
      zIndex: {
        "1": "var(--z-index-1)",
        "9": "var(--z-index-9)",
        "999": "var(--z-index-999)",
        "9999": "var(--z-index-9999)",
        "99999": "var(--z-index-99999)",
        "999999": "var(--z-index-999999)",
      },
      aspectRatio: {
        video: "var(--aspect-video)",
      },
      transitionDuration: {
        default: "var(--default-transition-duration)",
      },
      transitionTimingFunction: {
        default: "var(--default-transition-timing-function)",
        "ease-in-out": "var(--ease-in-out)",
      },
      ringWidth: {
        "3": "3px",
      },
      ringOpacity: {
        "10": "0.1",
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        spin: "var(--animate-spin)",
        ping: "var(--animate-ping)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
