# Enterprise Coding Standards

## 1. Code Quality & Sustainability
- **No Console Logs**: Eliminate `console.log` in production code. Use a logger.
- **Type Safety**: Avoid `any` in TypeScript. Define interfaces for all data structures.
- **Naming Conventions**: Use `camelCase` for functions/variables, `PascalCase` for components/classes.

## 2. User Interface (UI/UX)
- **Responsiveness**: All components must use Tailwind responsive prefixes (`md:`, `lg:`) to support mobile and desktop.
- **Accessibility**: All images must have `alt` tags. Inputs must have labels.
- **Theme**: Use the defined color palette (Zinc/Emerald). Avoid raw hex codes if possible; use Tailwind utility classes.
- **Error Handling**: UI Components must gracefully handle missing data (e.g., empty arrays, null values).

## 3. Performance
- **Server Components**: Prefer Server Components for data fetching.
- **Image Optimization**: Use `next/image` instead of `<img>`.
- **Dynamic Imports**: Use `dynamic()` for heavy client components.
