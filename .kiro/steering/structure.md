# Project Structure

## Directory Organization

```
src/
├── components/          # React UI components
│   ├── LanguageSelector.tsx
│   ├── MarketDataDisplay.tsx
│   ├── NegotiationInterface.tsx
│   ├── OfflineIndicator.tsx
│   ├── TransactionHistory.tsx
│   └── VoiceInterface.tsx
├── services/           # Business logic and external integrations
│   ├── LocalizationService.ts      # UI text translations
│   ├── TranslationService.ts       # Real-time message translation
│   ├── NegotiationService.ts       # AI negotiation assistance
│   ├── PriceDiscoveryService.ts    # Market price analysis
│   ├── TransactionService.ts       # Transaction recording
│   └── SessionManager.tsx          # Session state management
├── hooks/              # Custom React hooks
│   ├── useLocalization.ts          # Localization hook
│   ├── useSpeechSynthesis.ts       # Text-to-speech
│   └── useVoiceRecognition.ts      # Speech-to-text
├── tests/              # Test files (unit + property-based)
│   ├── *.test.ts                   # Unit tests
│   └── *.property.test.ts          # Property-based tests
├── theme/              # MUI theme customization
│   └── hariyaliTheme.ts            # Custom theme (green/agricultural)
├── examples/           # Example implementations
│   ├── LocalizationExample.tsx
│   └── TranslationServiceExample.tsx
├── App.tsx             # Main application component
└── index.tsx           # Application entry point
```

## Architecture Patterns

### Component Structure
- **Presentational Components**: Located in `components/`, handle UI rendering
- **Service Layer**: Located in `services/`, encapsulate business logic and external APIs
- **Custom Hooks**: Located in `hooks/`, provide reusable stateful logic

### Service Pattern
Services are singleton classes or exported instances that:
- Encapsulate specific domain logic (localization, translation, pricing)
- Manage external API integrations
- Provide consistent interfaces for components
- Handle data persistence (localStorage, IndexedDB)

### Naming Conventions
- **Components**: PascalCase (e.g., `VoiceInterface.tsx`)
- **Services**: PascalCase with "Service" suffix (e.g., `LocalizationService.ts`)
- **Hooks**: camelCase with "use" prefix (e.g., `useLocalization.ts`)
- **Tests**: Match source file name with `.test.ts` or `.property.test.ts` suffix
- **Theme**: camelCase with descriptive name (e.g., `hariyaliTheme.ts`)

## Key Files

- **App.tsx**: Main application shell with navigation and view routing
- **SessionManager.tsx**: Wraps components to provide session context
- **LocalizationService.ts**: Manages UI translations for 10+ languages
- **TranslationService.ts**: Handles real-time message translation
- **hariyaliTheme.ts**: Custom MUI theme with agricultural/green color scheme

## Configuration Files

- **tsconfig.json**: TypeScript compiler configuration
- **jest.config.js**: Jest testing configuration
- **config-overrides.js**: Webpack customization for CRA
- **package.json**: Dependencies and scripts
- **.kiro/specs/**: Feature specifications and requirements

## Spec-Driven Development

The project follows spec-driven development with structured documentation in `.kiro/specs/multilingual-mandi-platform/`:
- **requirements.md**: User stories and acceptance criteria
- **design.md**: Technical design and architecture decisions
- **tasks.md**: Implementation task breakdown
