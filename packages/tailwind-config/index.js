module.exports = {
  mode: "jit",
  content: [
    ".storybook/**/*.{js,ts,jsx,tsx}",
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/stories/*.stories.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          background: "#f3f6f8",
        },
        subject: {
          primary: "#019d91",
          base: "#20272c",
        },
        stroke: {
          neutral: "#d9e0e6",
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
