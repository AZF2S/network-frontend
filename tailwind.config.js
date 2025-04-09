/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"],
  theme: {
    extend: {
      colors: {
        "light-green": "#668C3C",
        "dark-green": "#0C2B1C",
        eggplant: "#7A3C5F",
        cream: "#CEC09D",
        orange: "#B55B2C",
        straw: "#A9A158",
        sage: "#568571",
        brown: "#A1762B",
        purple: "#5E617B",
        gray: "#919191",
        "light-gray": "#F2F2F2",
      },
    },
    backgroundImage: {
      "resources-header": "url('../src/assets/resources.png')",
      "newsletter-header": "url('../src/assets/newsletter.png')",
      "news-header-1": "url('../src/assets/lettuce.png')",
      "news-header-2": "url('../src/assets/carrots.png')",
      "news-header-3": "url('../src/assets/beans.png')",
      "subscribe-header": "url('../src/assets/subscribe.png')",
      "map-header": "url('../src/assets/map.png')",
    },
    screens: {
      sm: "902px",
      // => @media (min-width: 576px) { ... }

      md: "1200px",
      // => @media (min-width: 960px) { ... }

      lg: "1920px",
      // => @media (min-width: 1440px) { ... }
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
