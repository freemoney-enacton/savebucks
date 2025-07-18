import type { Config } from 'tailwindcss';
const { nextui } = require('@nextui-org/react');

const config: Config = {
  darkMode: 'selector',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/constants/promotion-status.ts',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      container: {
        center: true,
        padding: '1rem',
        screens: {
          DEFAULT: '1340px',
          sm: '100%',
          md: '100%',
          // lg: '1024px',
          xl: '1320px',
        },
      },
      colors: {
        primary: 'var(--primary)',
        'primary-light': 'var(--primary_light)',
        secondary: 'var(--secondary)',
        black: {
          DEFAULT: 'var(--body_bg)',
          600: 'var(--card_bg)',
          250: 'var(--card_secondary_bg)',
        },
        footer: {
          DEFAULT: 'var(--footer_bg)',
          text: 'var(--footer_text)',
        },
        btn: {
          'primary-text': 'var(--btn_primary_text)',
          'outline-text': 'var(--btn_outline_text)',
        },
        white: { DEFAULT: 'var(--body_text_secondary)' },
        purple: {
          DEFAULT: 'var(--purple)',
          500: 'var(--purple-500)',
          600: 'var(--purple-600)',
          200: 'var(--purple-200)',
          400: 'var(--purple-400)',
        },
        gray: {
          DEFAULT: 'var(--gray)',
          700: 'var(--gray-700)',
          600: 'var(--body_text_primary)',
          650: 'var(--gray-650)',
          400: 'var(--gray-400)',
          450: 'var(--gray-450)',
          490: 'var(--gray-490)',
          550: 'var(--gray-550)',
          500: 'var(--gray-500)',
          750: 'var(--gray-750)',
          800: 'var(--gray-800)',
        },
        orange: {
          DEFAULT: 'var(--orange)',
          200: 'var(--orange-200)',
          400: 'var(--orange-400)',
        },
        blue: {
          DEFAULT: 'var(--blue)',
          700: 'var(--blue-700)',
          500: 'var(--blue-500)',
          200: 'var(--blue-200)',
          400: 'var(--blue-400)',
        },
        yellow: { DEFAULT: 'var(--yellow)' },
        red: {
          DEFAULT: 'var(--red)',
          400: 'var(--red-400)',
          500: 'var(--red-500)',
        },
        green: {
          DEFAULT: 'var(--green)',
          190: 'var(--green-190)',
          200: 'var(--green-200)',
          330: 'var(--green-330)',
          400: 'var(--green-400)',
          500: 'var(--green-500)',
          450: 'var(--green-450)',
          350: 'var(--green-350)',
          750: 'var(--green-750)',
        },
        brown: 'var(--brown)',
        notification: {
          unread: 'var(--notification-unread)',
          read: 'var(--notification-read)',
        },
        rank: {
          1: 'var(--rank-1)',
          2: 'var(--rank-2)',
          3: 'var(--rank-3)',
          bg: 'var(--rank-bg)',
          'card-bg': 'var(--leaderboard-card-bg)',
          'card-border': 'var(--leaderboard-card-border)',
          '1-border': 'var(--leaderboard-rank-1-border)',
          '1-text': 'var(--leaderboard-rank-1-text)',
          '2-border': 'var(--leaderboard-rank-2-border)',
          '2-text': 'var(--leaderboard-rank-2-text)',
          '3-border': 'var(--leaderboard-rank-3-border)',
          '3-text': 'var(--leaderboard-rank-3-text)',
        },
        ladder: {
          1: 'var(--ladder-1)',
          2: 'var(--ladder-2)',
          3: 'var(--ladder-3)',
        },
        // next ui color overide
        content1: 'var(--card_bg)',
        default: { 500: 'var(--body_text_secondary)', foreground: 'var(--body_text_secondary)' },
        background: 'var(--body_bg)',
        foreground: 'var(--body_text_primary)',
        focus: 'var(--primary)',
        'spin-card': 'var(--spin-card)',
      },
      backgroundImage: {
        // gradients
        'primary-gr': 'var(--primary_gr)',
        'white-gr': 'var(--secondary_gr)',
        'tertiary-gr': 'var(--tertiary_gr)',
        'input-gr': 'var(--input_bg)', // input gradients
        // static gradients
        'sidebar-gr': 'var(--sidebar_gr)',
        'purple-gr': 'var(--purple_gr)',
        'blue-gr': 'var(--blue_gr)',
        'gray-gr': 'var(--gray_gr)',
        'ladder1-gr': 'var(--ladder1_gr)',
        // btns gradients
        'primary-btn-gr': 'var(--primary_btn_gr)',
        'outline-btn-border-gr': 'var(--outline_btn_border_gr)',
        'secondary-btn-gr': 'var(--secondary-btn-gr)',
        // static orange color
        'orange-gr': 'var(--orange-gr)',
        // border gradients
        'border-gr': 'var(--border_gr)',
        'border-gr2': 'var(--border-gr2)',
        'border-gr3': 'var(--border-gr3)',
        'img-overlay': 'var(--img-overlay)',
        // border hover gradient
        'border-hover-gr': 'var(--border_hover_gr)',
        // heading gradients
        'white-heading-gr': 'var(--section_title_gr)',
        // offer card banner gradient
        'offer-card-banner-gr': 'var(--offer-card-banner-gr)',
        // leaderboard card gradients
        'leaderboard-rank-1-border-gr': 'var(--leaderboard-rank-1-border-gr)',
        'leaderboard-rank-1-bg-gr': 'var(--leaderboard-rank-1-bg-gr)',
        'leaderboard-rank-1-ribbon-gr': 'var(--leaderboard-rank-1-ribbon-gr)',
        'leaderboard-rank-2-border-gr': 'var(--leaderboard-rank-2-border-gr)',
        'leaderboard-rank-2-bg-gr': 'var(--leaderboard-rank-2-bg-gr)',
        'leaderboard-rank-2-ribbon-gr': 'var(--leaderboard-rank-2-ribbon-gr)',
        'leaderboard-rank-3-border-gr': 'var(--leaderboard-rank-3-border-gr)',
        'leaderboard-rank-3-bg-gr': 'var(--leaderboard-rank-3-bg-gr)',
        'leaderboard-rank-3-ribbon-gr': 'var(--leaderboard-rank-3-ribbon-gr)',
      },
      boxShadow: {
        'chat-box': 'var(--chat-box)',
        100: 'var(--shadow-100)',
        'cashout-card': '0px 4px 24px -1px #00000033,0px 4px 4px 0px #00000040',
        modal: '0px 0px 100px 0px #FFFFFF4D',
        'offer-card': '0px 0px 15px 0px #FFFFFF80',
        'offer-card2': '2px 2px 6px .5px #ffbc07, -2px -2px 6px .5px #ffbc07;',
        'leaderboard-ring': 'var(--shadow-leaderboard-ring)',
        'leaderboard-card': 'var(--shadow-leaderboard-card)',
        'drop-leaderboard-card': 'var(--shadow-drop-leaderboard-card)',
      },
      fontSize: {
        '8px': ['8px', '11px'],
        xxs: ['10px', '15px'],
        '11px': ['11px', '16px'],
        '13px': ['13px', '18px'],
        '15px': ['15px', '20px'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': {
            opacity: '0',
          },
          '100%': {
            opacity: '1',
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    nextui({
      themes: {
        dark: {
          extend: 'dark',
        },
        // for now we are not using this theme.
        light: {
          extend: 'light',
        },
      },
    }),
  ],
};
export default config;
