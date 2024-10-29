const { addDynamicIconSelectors } = require("@iconify/tailwind");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/*.html"],
  theme: {
    extend: {
      colors: {
        whiteone: "#CED4DA",
        whitetwo: "#DEE2E6",
        whitethree: "#E9ECEF",
        greyone: "#495057",
        greyoneop: "rgba(73, 80, 87, 0.5)",
        greytwo: "#343A40",
        greenone: "#6DD483",
        greentwo: "#4A9A77",
        yellowone: "#DEE178",
        yellowtwo: "#E0E06D",
        blueone: "#73CDE1",
        datecol: "#B4BFCF",
        cardred: "#FF8080",
        cardredhov: "#FC8D8D",
        cardredactive: "#DD6F6F",
      },
      fontFamily: {
        brico: "Bricolage Grotesque",
      },
    },
  },
  plugins: [addDynamicIconSelectors()],
};