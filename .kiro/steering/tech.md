# Technology Stack

## Core Technologies

- **Framework**: React 18.2 with TypeScript 4.9
- **Build System**: Create React App with react-app-rewired for custom webpack configuration
- **UI Library**: Material-UI (MUI) v5.15 with Emotion for styling
- **Testing**: Jest + ts-jest with jsdom environment
- **Property-Based Testing**: fast-check v4.5.3

## Key Dependencies

- **Translation**: @google-cloud/translate v9.3
- **Browser Polyfills**: Extensive Node.js polyfills for browser compatibility (crypto, stream, buffer, etc.)
- **Web APIs**: Web Speech API for voice recognition and synthesis

## Build Configuration

### Webpack Customization
Uses `config-overrides.js` to provide Node.js polyfills for browser environment, enabling server-side libraries to run client-side.

### TypeScript Configuration
- Target: ES5 for broad browser compatibility
- Strict mode: Disabled for flexibility
- Module: ESNext with Node resolution
- JSX: react-jsx (new JSX transform)

## Common Commands

```bash
# Development
npm start              # Start development server (port 3000)

# Testing
npm test              # Run tests in watch mode
npm test -- --run     # Run tests once without watch

# Production
npm run build         # Create optimized production build

# Package Management
npm install           # Install dependencies
```

## Testing Guidelines

- Unit tests: Co-located with source files using `.test.ts` or `.test.tsx` suffix
- Property-based tests: Use `.property.test.ts` suffix
- Test files excluded from TypeScript compilation (see tsconfig.json)
- Jest configured to transform fast-check for ESM compatibility

## Browser Compatibility

Targets modern browsers with fallbacks:
- Production: >0.2% usage, not dead, not Opera Mini
- Development: Latest Chrome, Firefox, Safari

## Performance Considerations

- Mobile-first responsive design (320px - 1920px)
- 3G network optimization (5-second load target)
- Offline-first architecture with service workers

## MVP Constraints

This is a hackathon MVP - keep implementations simple:
- Focus on core voice and translation features
- Avoid complex backend integrations
- Use mock data where appropriate for demos
- Prioritize working demo over production-ready code
