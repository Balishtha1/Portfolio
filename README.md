# Manas Soni — Latent Space (Premium Edition)

An interactive 3D portfolio for Manas Soni. Built with React, TypeScript, Vite, React Three Fiber, shader-driven celestial environments, Framer Motion and Lenis.

## Run on your Mac

1. Unzip the project.
2. Open the unzipped `manas-latent-space-premium` folder in VS Code.
3. Open **Terminal → New Terminal** and run:

```bash
npm install
npm run dev
```

4. Visit http://localhost:5173/

Build/check:

```bash
npm run typecheck
npm run build
```

## If you already have a project running

Make a backup of your current `manas-latent-space` folder first. You may replace its contents with the **contents** of this new folder, keeping your own Git `.git` folder if already connected. If you have personal changes, compare/merge instead of overwriting.

## Customize before publishing

- `src/data/portfolio.ts`: Edit profile, school, projects, experience and skills.
- Add verified GitHub and LinkedIn URLs into `portfolio.links` (empty links are deliberately hidden).
- `public/Manas_Soni_Resume.pdf`: resume supplied in chat; change it when updated.
- `src/styles.css`: all typography, visual styling and responsive layout.
- `src/scene/Universe.tsx`: 3D camera rail, planets, lighting and scene performance.
- `src/shaders/space.ts`: planet/star/nebula materials.
- `src/components/Interface.tsx`: global navigation, ambient sound and mini terminal.

The contact link opens your email app; no backend is required. Before deploying, check whether you're comfortable publishing your email and attached resume.

## Deployment

Push the project to GitHub, then import it into Vercel. Framework: Vite; build: `npm run build`; output: `dist`.

## Accessibility/performance

Honors reduced-motion preferences; WebGL errors fall back to the content. Scene automatically reduces detail for mobile and low frame-rate contexts.

## Recruiter-first update

This version includes your supplied portrait at `public/manas-portrait.jpg` and your supplied LinkedIn, GitHub, phone and email details. Review the personal information before publishing the repository publicly. The Skills section lists resume technologies and illustrates an ML pipeline; it is **not** a claim that every stage has shipped in production.

For local development run `npm install`, then `npm run typecheck`, then `npm run dev` in this folder. Replace `public/manas-portrait.jpg` to change the profile photo.
