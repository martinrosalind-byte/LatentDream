/**
 * @file tailwind.config.js
 * @description Core configuration layout framework for the Tailwind CSS design system.
 * Configures explicit content path matrices across the client-side presentation layer 
 * to automate modular design generation for the LatentDream UI framework.
 */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
