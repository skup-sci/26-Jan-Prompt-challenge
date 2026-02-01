# Design Document - Multilingual Mandi (Hackathon MVP)

## Introduction

This document describes the technical design for a voice-first, mobile-friendly web application that enables multilingual communication and AI-assisted trading for Indian market vendors.

## Design Principles

1. **Voice-First**: Primary interaction through speech, with text as fallback
2. **Low-Literacy Friendly**: Icons, colors, and minimal text
3. **Mobile-First**: Optimized for smartphones (320px+)
4. **Hariyali Theme**: Green agricultural colors, high contrast
5. **Simple Navigation**: Maximum 4 screens, clear purpose for each

## Technology Stack

### Frontend
- **Framework**: React 18.2 with TypeScript
- **UI Library**: Material-UI (MUI) v5.15
- **Styling**: Emotion (CSS-in-JS)
- **State Management**: React hooks (useState, useContext)

### Voice & Translation
- **Speech Recognition**: Web Speech API (browser native)
- **Text-to-Speech**: Web Speech API (browser native)
- **Translation**: @google-cloud/translate v9.3 (or mock for demo)

### Data & Storage
- **Price Data**: Mock/sample data in JSON format
- **Storage**: Browser localStorage for preferences
- **No Backend**: Pure frontend application for MVP

## Color Palette (Hariyali Theme)

```typescript
// Primary Colors
primary: {
  main: '#4CAF50',      // Vibrant green (main actions)
  light: '#81C784',     // Light green (hover states)
  dark: '#388E3C',      // Dark green (pressed states)
}

// Secondary Colors
secondary: {
  main: '#FFA726',      // Orange (alerts, warnings)
  light: '#FFB74D',
  dark: '#F57C00',
}

// Background
background: {
  default: '#F1F8E9',   // Very light green
  paper: '#FFFFFF',     // White cards
}

// Text
text: {
  primary: '#1B5E20',   // Dark green (high contrast)
  secondary: '#558B2F', // Medium green
}

// Status Colors
success: '#66BB6A',     // Green
warning: '#FFA726',     // Orange
error: '#EF5350',       // Red
info: '#42A5F5',        // Blue
```

## Screen Designs

### 1. Home Screen (Voice Assistant)

**Purpose**: Main entry point, voice-first interaction

**Layout**:
```
┌─────────────────────────────────┐
│  🌾 Mandi Platform    [🌐 हिं]  │ ← Header (language selector)
├─────────────────────────────────┤
│                                 │
│     "Tap mic and speak"         │ ← Instruction text
│                                 │
│         ┌─────────┐             │
│         │         │             │
│         │   🎤    │             │ ← Large circular mic button
│         │         │             │   (120px diameter, pulsing when active)
│         └─────────┘             │
│                                 │
│    "या टाइप करें..."            │ ← Text input (collapsible)
│    [________________]           │
│                                 │
│  ┌──────┐  ┌──────┐  ┌──────┐  │
│  │ 💰   │  │ 🤝   │  │ ❓   │  │ ← Quick action buttons
│  │Price │  │Chat  │  │Help  │  │   (80px x 80px each)
│  └──────┘  └──────┘  └──────┘  │
│                                 │
│  Recent: "Onion price?"         │ ← Recent queries (optional)
│                                 │
└─────────────────────────────────┘
```

**Components**:
- Header with app name and language selector
- Large circular microphone button (primary action)
- Visual feedback: pulsing animation when listening
- Collapsible text input field
- Three large quick-action buttons
- Recent queries list (last 3)

**Interactions**:
- Tap mic → Start voice recognition → Show "Listening..."
- Tap again → Stop listening
- Voice detected → Show transcript → Process command
- Tap text field → Expand keyboard input
- Tap quick actions → Navigate to specific screen

### 2. Price Result Screen

**Purpose**: Display commodity price information

**Layout**:
```
┌─────────────────────────────────┐
│  ← Back          🔊 Speak        │ ← Navigation
├─────────────────────────────────┤
│                                 │
│         🧅 Onion                │ ← Commodity icon + name
│                                 │
│      ₹40 per kg                 │ ← Large price display
│                                 │
│  📍 Delhi Azadpur Mandi         │ ← Market location
│  📅 Today, 2:30 PM              │ ← Timestamp
│                                 │
│  ┌─────────────────────────┐   │
│  │  Price Trend            │   │ ← Simple trend indicator
│  │  ↗️ +5% from yesterday   │   │
│  └─────────────────────────┘   │
│                                 │
│  Similar Prices:                │
│  • Potato: ₹30/kg               │ ← Related commodities
│  • Tomato: ₹50/kg               │
│                                 │
│  ┌──────────────┐               │
│  │ Start Negotiation 🤝 │       │ ← Action button
│  └──────────────┘               │
│                                 │
│         [🎤 Ask Again]           │ ← Voice button (smaller)
│                                 │
└─────────────────────────────────┘
```

**Components**:
- Back button and speak button in header
- Large commodity icon (emoji or image)
- Prominent price display (48px font)
- Market location and timestamp
- Simple trend indicator (up/down arrow)
- Related commodities list
- Action button to start negotiation
- Smaller mic button for new query

**Interactions**:
- Tap "Speak" → Read entire result aloud
- Tap "Start Negotiation" → Navigate to chat screen
- Tap "Ask Again" → Return to home with voice active

### 3. Negotiation Chat Screen

**Purpose**: Vendor-to-vendor communication with AI assistance

**Layout**:
```
┌─────────────────────────────────┐
│  ← Back    Onion Deal    [🌐]   │ ← Header
├─────────────────────────────────┤
│                                 │
│  ┌─────────────────────────┐   │
│  │ 🤖 AI Suggestion:       │   │ ← AI assistant card
│  │ Market price: ₹40/kg    │   │   (sticky at top)
│  │ Suggest: Start at ₹38   │   │
│  └─────────────────────────┘   │
│                                 │
│  You: "₹35 per kg?"             │ ← Your message (right)
│  [Original: "₹35 प्रति किलो?"]  │   (with translation)
│                                 │
│  Vendor: "Too low, ₹42"         │ ← Their message (left)
│  [Original: "बहुत कम, ₹42"]     │
│                                 │
│  🤖 Try: "₹38 is fair"          │ ← AI suggestion bubble
│                                 │
│  You: "₹38 final?"              │
│                                 │
├─────────────────────────────────┤
│  [________________]  [🎤] [📤]  │ ← Input bar
│   Type message...               │   (text + voice + send)
└─────────────────────────────────┘
```

**Components**:
- Sticky AI suggestion card at top
- Chat bubbles (yours: right/green, theirs: left/white)
- Translation shown in smaller text below each message
- AI suggestion bubbles (orange, between messages)
- Input bar with text field, mic button, send button

**Interactions**:
- Tap mic → Record voice message → Auto-translate → Send
- Type message → Tap send → Auto-translate → Send
- Tap AI suggestion → Insert into input field
- Messages auto-scroll to bottom
- Pull down to see AI suggestion card

### 4. Help Screen

**Purpose**: Quick guide for using the app

**Layout**:
```
┌─────────────────────────────────┐
│  ← Back          Help            │
├─────────────────────────────────┤
│                                 │
│  🎤 Voice Commands              │
│  ┌─────────────────────────┐   │
│  │ "Onion price"           │   │ ← Example cards
│  │ "Start negotiation"     │   │
│  │ "Change language"       │   │
│  └─────────────────────────┘   │
│                                 │
│  🌐 Languages                   │
│  ┌─────────────────────────┐   │
│  │ हिंदी  English  தமிழ்   │   │ ← Language grid
│  │ తెలుగు  বাংলা  मराठी    │   │
│  │ ગુજરાતી ಕನ್ನಡ മലയാളം    │   │
│  │ ਪੰਜਾਬੀ                  │   │
│  └─────────────────────────┘   │
│                                 │
│  💡 Tips                        │
│  • Speak clearly                │
│  • Use commodity names          │
│  • Check prices before deal     │
│                                 │
│  📞 Demo Mode                   │
│  This is a demo with sample     │
│  data. No real transactions.    │
│                                 │
└─────────────────────────────────┘
```

**Components**:
- Voice command examples in cards
- Language selector grid (all 10 languages)
- Simple tips list
- Demo mode disclaimer

**Interactions**:
- Tap language → Change app language → Return to home
- Tap example command → Copy to home screen input
- Scroll to see all content

## Component Architecture

### Core Components

```typescript
// Main App Shell
App.tsx
├── LanguageProvider (Context)
├── VoiceProvider (Context)
└── Router
    ├── HomeScreen
    ├── PriceResultScreen
    ├── NegotiationScreen
    └── HelpScreen

// Reusable Components
components/
├── VoiceMicButton.tsx          // Large circular mic with animation
├── LanguageSelector.tsx        // Dropdown/modal for language selection
├── PriceCard.tsx               // Display commodity price
├── ChatBubble.tsx              // Message bubble with translation
├── AISuggestionCard.tsx        // AI assistant suggestions
├── QuickActionButton.tsx       // Large icon buttons
└── Header.tsx                  // App header with back/language
```

### Services

```typescript
services/
├── VoiceService.ts             // Web Speech API wrapper
│   ├── startRecognition()
│   ├── stopRecognition()
│   ├── speak()
│   └── getSupportedLanguages()
│
├── TranslationService.ts       // Translation logic
│   ├── translate(text, from, to)
│   ├── detectLanguage(text)
│   └── SUPPORTED_LANGUAGES
│
├── PriceService.ts             // Mock price data
│   ├── getPrice(commodity)
│   ├── searchCommodity(query)
│   └── SAMPLE_PRICES
│
└── NegotiationService.ts       // AI suggestions
    ├── getSuggestion(context)
    ├── evaluateOffer(price, market)
    └── generateCounterOffer()
```

### Hooks

```typescript
hooks/
├── useVoiceRecognition.ts      // Voice input hook
│   └── Returns: { transcript, isListening, start, stop }
│
├── useSpeechSynthesis.ts       // Text-to-speech hook
│   └── Returns: { speak, isSpeaking, cancel }
│
├── useTranslation.ts           // Translation hook
│   └── Returns: { translate, currentLang, changeLang }
│
└── useLocalStorage.ts          // Persist preferences
    └── Returns: { value, setValue }
```

## Data Models

### Commodity Price

```typescript
interface CommodityPrice {
  id: string;
  name: string;              // "Onion"
  nameLocal: string;         // "प्याज"
  price: number;             // 40
  unit: string;              // "kg" or "quintal"
  market: string;            // "Delhi Azadpur Mandi"
  timestamp: Date;
  trend: 'up' | 'down' | 'stable';
  changePercent: number;     // 5.0
  icon: string;              // "🧅" or image URL
}
```

### Chat Message

```typescript
interface ChatMessage {
  id: string;
  sender: 'user' | 'vendor';
  text: string;              // Translated text
  originalText: string;      // Original language text
  language: LanguageCode;
  timestamp: Date;
  isVoice: boolean;
}
```

### AI Suggestion

```typescript
interface AISuggestion {
  type: 'price' | 'counter' | 'accept' | 'reject';
  message: string;           // "Market price is ₹40/kg"
  action?: string;           // "Suggest: Start at ₹38"
  confidence: number;        // 0.85
}
```

### Language

```typescript
type LanguageCode = 'en' | 'hi' | 'ta' | 'te' | 'bn' | 
                    'mr' | 'gu' | 'kn' | 'ml' | 'pa';

interface Language {
  code: LanguageCode;
  name: string;              // "हिंदी"
  nameEnglish: string;       // "Hindi"
  voiceCode: string;         // "hi-IN" for Web Speech API
}
```

## Sample Data Structure

### Mock Prices (PriceService.ts)

```typescript
const SAMPLE_PRICES: CommodityPrice[] = [
  {
    id: 'onion',
    name: 'Onion',
    nameLocal: 'प्याज',
    price: 40,
    unit: 'kg',
    market: 'Delhi Azadpur Mandi',
    timestamp: new Date(),
    trend: 'up',
    changePercent: 5.0,
    icon: '🧅'
  },
  {
    id: 'tomato',
    name: 'Tomato',
    nameLocal: 'टमाटर',
    price: 50,
    unit: 'kg',
    market: 'Mumbai Vashi Mandi',
    timestamp: new Date(),
    trend: 'down',
    changePercent: -3.0,
    icon: '🍅'
  },
  // ... more commodities
];
```

## Voice Recognition Flow

```
User taps mic button
    ↓
Start Web Speech API recognition
    ↓
Show "Listening..." with pulsing animation
    ↓
User speaks: "Onion price"
    ↓
Recognition returns transcript
    ↓
Display transcript: "You said: Onion price"
    ↓
Parse command (extract: commodity="onion", action="price")
    ↓
Call PriceService.getPrice("onion")
    ↓
Navigate to PriceResultScreen with data
    ↓
Speak result using text-to-speech
```

## Translation Flow

```
User types message: "₹35 per kg?"
    ↓
Detect source language: Hindi
    ↓
Get recipient language: Tamil
    ↓
Call TranslationService.translate("₹35 per kg?", "hi", "ta")
    ↓
Receive translation: "₹35 கிலோவுக்கு?"
    ↓
Display both versions in chat bubble:
  - Original (small): "₹35 per kg?"
  - Translated (large): "₹35 கிலோவுக்கு?"
    ↓
Send to recipient
```

## Negotiation AI Logic

```typescript
function getSuggestion(context: NegotiationContext): AISuggestion {
  const { commodity, marketPrice, currentOffer, history } = context;
  
  // Simple rule-based logic for MVP
  const difference = ((currentOffer - marketPrice) / marketPrice) * 100;
  
  if (difference < -10) {
    return {
      type: 'counter',
      message: `Offer is ${Math.abs(difference)}% below market`,
      action: `Suggest: Counter with ₹${marketPrice * 0.95}`,
      confidence: 0.8
    };
  } else if (difference > 10) {
    return {
      type: 'reject',
      message: `Offer is ${difference}% above market`,
      action: 'Suggest: Reject and offer market price',
      confidence: 0.9
    };
  } else {
    return {
      type: 'accept',
      message: 'Offer is close to market price',
      action: 'Suggest: Accept or counter slightly',
      confidence: 0.85
    };
  }
}
```

## Responsive Breakpoints

```typescript
// Mobile First
xs: 0px      // Small phones (320px+)
sm: 600px    // Large phones
md: 960px    // Tablets
lg: 1280px   // Desktop (optional for this MVP)

// Component sizing
Mobile (xs-sm):
  - Mic button: 120px diameter
  - Quick actions: 80px x 80px
  - Font sizes: 18px body, 48px price
  - Padding: 16px

Tablet (md+):
  - Mic button: 150px diameter
  - Quick actions: 100px x 100px
  - Font sizes: 20px body, 56px price
  - Padding: 24px
```

## Accessibility Features

1. **High Contrast**: Dark green text on light backgrounds
2. **Large Touch Targets**: Minimum 48px (WCAG AAA)
3. **Voice Feedback**: Speak all important actions
4. **Visual Feedback**: Animations for voice recognition
5. **Icon + Text**: Never rely on icons alone
6. **Simple Language**: Avoid technical jargon

## Performance Targets

- **Initial Load**: < 3 seconds on 3G
- **Voice Recognition Start**: < 500ms
- **Translation**: < 2 seconds
- **Screen Transitions**: < 300ms (smooth animations)
- **Text-to-Speech Start**: < 500ms

## Browser Compatibility

**Required**:
- Chrome 80+ (Android/Desktop)
- Safari 14+ (iOS)
- Firefox 90+ (Android/Desktop)

**Web Speech API Support**:
- Chrome: Full support
- Safari: Partial (recognition may need fallback)
- Firefox: Partial (may need polyfill)

**Fallback Strategy**:
- If voice not supported → Show text input only
- If translation API fails → Show original text
- If localStorage not available → Use session state

## Testing Strategy

### Unit Tests
- Voice service functions
- Translation service
- Price lookup logic
- AI suggestion algorithm

### Property-Based Tests (fast-check)
- Translation preserves numbers
- Price calculations are accurate
- Language codes are valid
- Message ordering in chat

### Manual Testing
- Voice recognition in each language
- UI on different screen sizes
- Touch interactions on mobile
- Text-to-speech quality

## Deployment

**Hosting**: Static hosting (Vercel, Netlify, GitHub Pages)
**Build**: `npm run build` → Static files
**Environment**: No backend required
**Configuration**: Environment variables for API keys (if using real translation API)

## Future Enhancements (Post-MVP)

- Offline mode with service workers
- Real-time vendor matching
- Photo upload for commodity quality
- Location-based market selection
- Push notifications for price alerts
- Progressive Web App (PWA) installation

## Correctness Properties

### Property 1: Translation Bidirectionality
**Validates: Requirement 1.3, 1.4**

For any text T and languages L1, L2:
- translate(translate(T, L1, L2), L2, L1) should preserve meaning
- Numbers and prices must remain unchanged

### Property 2: Price Consistency
**Validates: Requirement 3.2, 3.3**

For any commodity C:
- getPrice(C).price > 0
- getPrice(C).unit in ['kg', 'quintal']
- getPrice(C).trend in ['up', 'down', 'stable']

### Property 3: Voice Recognition Accuracy
**Validates: Requirement 2.3**

For any voice input V in language L:
- Recognition time < 2 seconds
- Transcript should be non-empty
- Language should match selected language

### Property 4: AI Suggestion Validity
**Validates: Requirement 4.2, 4.3**

For any negotiation context:
- Suggestion price should be within ±20% of market price
- Confidence score should be between 0 and 1
- Suggestion type should be valid enum value

### Property 5: UI Responsiveness
**Validates: Requirement 5.4**

For any screen width W where 320 <= W <= 1920:
- All interactive elements should be visible
- Touch targets should be >= 48px
- Text should be readable (font size >= 14px)

### Property 6: Message Ordering
**Validates: Requirement 6.2**

For any chat conversation:
- Messages should be ordered by timestamp
- Each message should have unique ID
- Translation should preserve message order
