# Holidaze

A modern venue booking application built with React, Vite, and Tailwind CSS.

## Dependencies

### Core Dependencies
- **React** (^18.2.0) - UI library
- **React DOM** (^18.2.0) - React DOM rendering
- **React Router DOM** (^6.20.1) - Client-side routing
- **React Loader Spinner** (^5.4.5) - Loading animations

### Development Dependencies
- **Vite** (^4.5.0) - Build tool and dev server
- **@vitejs/plugin-react** (^4.1.1) - React plugin for Vite
- **Tailwind CSS** (^3.3.5) - Utility-first CSS framework
- **PostCSS** (^8.4.31) - CSS processing
- **Autoprefixer** (^10.4.16) - CSS vendor prefixing
- **ESLint** (^8.53.0) - Code linting
- **gh-pages** (^6.1.0) - GitHub Pages deployment

## Quick Start

1. **Install dependencies:**
```bash
npm install
```

2. **Start development server:**
```bash
npm run dev
```

3. **Build for production:**
```bash
npm run build
```

4. **Preview production build:**
```bash
npm run preview
```

## Available Scripts

- `npm run dev` - Starts Vite development server
- `npm run build` - Builds for production
- `npm run preview` - Previews production build locally
- `npm run lint` - Runs ESLint for code quality
- `npm run deploy` - Deploys to GitHub Pages
- `npm run setup` - Runs GitHub project setup
- `npm run setup-basic` - Runs basic GitHub setup

## GitHub Pages Configuration

The project is configured for GitHub Pages deployment with:
- Base path: `/holidaze/` for production builds
- Output directory: `dist/`
- Automatic deployment via GitHub Actions 

### Manual Deployment
To manually deploy to GitHub Pages:
```bash
npm run deploy
```
