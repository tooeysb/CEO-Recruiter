# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands
- `npm run dev` - Start the development server with Vite
- `npm run build` - Build the production version
- `npm run lint` - Run ESLint to check code quality
- `npm run preview` - Preview the production build locally

## Project Structure
- `/src` - React application source code
  - `/components` - UI components organized by feature
  - `/lib` - Utility functions and services
  - `/pages` - Page components for routing
  - `/types` - TypeScript type definitions
- `/public` - Static assets and files
- `/supabase/migrations` - Database migration scripts

## Code Style Guidelines

### TypeScript
- Use TypeScript for all new code with proper type annotations
- Enable strict mode in tsconfig.json
- Define explicit types for function parameters and return values
- Use interface for object shapes (e.g., `interface ButtonProps`)
- Use type aliases for unions/primitives (e.g., `type ButtonVariant = 'primary' | 'secondary'`)

### Components
- Use functional components with React hooks
- Export components as default exports
- Define prop interfaces above component definitions
- Destructure props in function parameters
- Use sensible defaults for optional props

### Naming Conventions
- PascalCase for components, interfaces, and type aliases
- camelCase for variables, functions, and instances
- Use descriptive, meaningful names

### Formatting
- 2 space indentation
- Use semicolons
- Use single quotes for strings
- Use trailing commas in multiline objects/arrays

### Error Handling
- Wrap async operations in try/catch blocks
- Use console.error for logging errors
- Provide user-friendly error messages
- Handle API errors gracefully with specific error messages

### Styling
- Use Tailwind CSS for styling components
- Follow utility-first approach
- Group related classes together
- Extract common class patterns into variables for reuse

### Database
- Use Supabase for database operations
- Define proper database migrations with comments
- Include index creation for performance
- Use row-level security policies