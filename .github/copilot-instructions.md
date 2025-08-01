# Copilot Instructions

You are assisting with a white-label URL Shortener project built with:
- Next.js
- TypeScript
- TailwindCSS
- MongoDB

## White-Label Configuration

This is a white-label project where all branding and configuration is centralized in `src/lib/config.ts`. When making changes:

1. Never hardcode brand-specific values in components
2. All configurable values should be added to the config file
3. Use conditional rendering for optional features
4. Support empty/null values for optional configuration
5. Document new configuration options
6. Keep the config type-safe and well-documented

## Project Context

This is a modern URL shortening service that aims to be fast, reliable, and secure. The project follows these principles:

- Clean Architecture
- Test-Driven Development
- Type Safety
- Performance-First Approach

## User Interaction Guidelines

- Provide analysis, suggestions, and code examples, if the change will be very impactiful, spanning through several files, provide a summary of the changes to be made and wait for user approval
- Feel free to browse to project files to understand the context

## Coding Standards

When suggesting code:

1. Use TypeScript with strict type checking
2. Follow the existing project structure:
   - `src/app/` - Next.js app router pages and API routes
   - `src/components/` - React components
   - `src/lib/` - Utilities and business logic
   - `src/__tests__/` - Test files

3. Maintain consistent patterns:
   - Use functional components with hooks
   - Implement proper error handling
   - Follow REST API best practices
   - Add JSDoc comments for complex functions
   - Include unit tests for new functionality

4. Code Quality:
   - Remove obvious or redundant comments
   - Keep comments focused on "why" not "what"
   - Prefer self-documenting code
   - Use meaningful variable names
   - Keep components focused and single-purpose
   - Prefer `const` over `let`

## API Design & Production Standards

- Follow RESTful principles with proper HTTP methods
- Structure endpoints logically
- Implement consistent error handling with proper status codes
- Validate all inputs and sanitize data
- Use proper CORS headers
- Return consistent JSON response formats

## Security Considerations

1. Validate all user inputs
2. Prevent URL abuse and spam
3. Follow security best practices for URL handling
4. Implement rate limiting where necessary
5. Sanitize URLs before storing/redirecting
6. Handle database connection errors
7. Implement proper authentication and authorization checks
8. Hash sensitive data appropriately

## Error Handling & User Feedback

1. Display user-friendly error messages
2. Log detailed errors server-side only
3. Use try/catch blocks for all async operations
4. Provide fallback UI for error states
5. Show loading states for async operations
6. Implement skeleton loading where appropriate
7. Provide immediate visual feedback for user interactions

## Testing Requirements

1. Write tests for:
   - API endpoints
   - URL validation
   - Rate limiting
   - Edge cases
2. Use Jest for testing
3. Follow the existing test patterns in `src/__tests__/`

## Performance Guidelines

1. Optimize database queries
2. Implement proper caching strategies
3. Follow Next.js best practices
4. Keep bundle size minimal
5. Consider edge runtime where applicable
6. Extract reusable logic into proper utilities
7. Use computed properties for derived state
8. Keep API logic in appropriate stores
