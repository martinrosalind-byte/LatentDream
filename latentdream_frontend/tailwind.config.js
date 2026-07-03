/**
 * @file tailwind.config.js
 * @description Configures the Tailwind CSS framework architecture components. 
 * Defines target source file processing paths to ensure utility classes used 
 * in the user interface components are correctly scanned and compiled.
 */

/** @type {import('tailwindcss').Config} */
export default {
  // Explicitly registers source directories for structural utility extraction
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}