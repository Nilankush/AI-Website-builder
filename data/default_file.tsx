export default{
    DEFAULT_FILE: {
        '/public/index.html': {
          code: `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body>
        <div id="root"></div>
      </body>
    </html>`
        },
        '/App.css': {
          code: `
    @tailwind base;
    @tailwind components;
    @tailwind utilities;`
        },
        '/tailwind.config.js': {
          code: `
                /** @type {import('tailwindcss').Config} */
    module.exports = {
      content: [
        "./src/**/*.{js,jsx,ts,tsx}",
      ],
      theme: {
        extend: {},
      },
      plugins: [],
    }`
        },
        '/postcss.config.js': {
          code: `/** @type {import('postcss-load-config').Config} */
    const config = {
      plugins: {
        tailwindcss: {},
      },
    };
    
    export default config;
    `
        }
    }
}