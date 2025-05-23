# Project Notes

---

**[Previous Branches]**
- `feature/hotel-cards`: Implemented hotel card grid and hotel data fetching.
- `feature/tailwind-setup`: Set up Tailwind CSS and initial global styles.
- `feature/basic-layout`: Created initial page structure and container layout.

---

**[React Migration Changes]**

1. **Build Configuration**
- Updated Vite config to support React and client-side routing
- Added historyApiFallback for proper React Router handling
- Configured port and development server settings
```js
// vite.config.js changes
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    historyApiFallback: true // Enables client-side routing
  }
});
```

2. **Style Processing**
- Added PostCSS for advanced CSS processing capabilities
- Configured autoprefixer to handle browser-specific CSS prefixes
- Added WebKit text adjustments for better mobile rendering
```js
// postcss.config.js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}, // Handles vendor prefixes automatically
  },
}
```

3. **Tailwind Configuration**
- Updated content paths to include JSX files
- Improved file scanning patterns
```js
// tailwind.config.js
content: [
  "./index.html",
  "./src/**/*.{js,jsx,ts,tsx}", // Include all React file types
],
```

4. **HTML Structure**
- Removed legacy class-based structure
- Added meta description for SEO
- Properly configured root element for React mounting
- Added cross-origin attributes for font loading

5. **Component Changes**
- Converted all class components to functional components
- Updated file extensions from .js to .jsx
- Implemented proper React Router v6 syntax
- Added proper event handling and state management

---

**[Commit Message Style Explanations]**

feat(build): Configure Vite for React and client-side routing
- Added historyApiFallback for proper route handling
- Configured development server settings
- Ensures proper module resolution for React

feat(styles): Add PostCSS and cross-browser compatibility
- Added autoprefixer for vendor prefix handling
- Configured WebKit text adjustments for mobile
- Improves text rendering across different browsers

feat(components): Migrate to React functional components
- Converted class components to functional components
- Updated file extensions to .jsx
- Implements React best practices

chore(config): Update Tailwind configuration
- Added JSX file pattern scanning
- Improved content path configuration
- Ensures proper style processing for React components

---

**[Style Handling]**
- PostCSS: Added for advanced CSS processing and future compatibility
- WebKit: Added text-size-adjust properties to prevent mobile browsers from automatically adjusting text size
- Autoprefixer: Automatically handles vendor prefixes for cross-browser compatibility

---

**[React Router Implementation]**
- Using React Router v6 with BrowserRouter
- Implemented protected routes for authenticated sections
- Added proper navigation handling with useNavigate hook

---

**[Component Structure]**
- App.jsx: Main application wrapper with routing
- NavMenu.jsx: Navigation component with auth awareness
- AuthContext.jsx: Authentication state management
- Protected components: Wrapped with auth checks

---

**[NavMenu]**
- Created a navigation bar component with logo, three links, and a profile icon.
- Moved nav styles to a dedicated CSS file (`NavMenu.css`).
- Injected the nav into a `<header>` element in `index.html`.
- Updated nav link names to: Home, Venues, New booking.
- Set nav link color to black, with underline on active (future: add logic for active state if needed).

**[Footer]**
- Created a simple one-line footer component and CSS, rendered in a `<footer>` element in `index.html`.
- Footer text: "Holidaze all rights reserved 2025 ©".

**[Global Styles]**
- Imported the "Outfit" font from Google Fonts in `index.html`.
- Set `font-family: 'Outfit', sans-serif;` globally in `styles.css`.

---

