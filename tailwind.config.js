const { addDynamicIconSelectors } = require('@iconify/tailwind');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/*.html"],
  theme: {
    colors: {
      whiteone: "#CED4DA",
      whitetwo: "#DEE2E6",
      whitethree: "#E9ECEF",
      greyone: "#495057",
      greytwo: "#343A40",
      redone: "#E8604E",
      greenone: "#6DD483",
      greentwo: "#4A9A77",
      yellowone: "#DEE178",
      yellowtwo: "#E0E06D",
      blueone: "#73CDE1",
    },
    fontFamily: {
      brico: "Bricolage Grotesque",
    },
  },
  plugins: [
      addDynamicIconSelectors(),
  ],
};
