# Implementation Tasks - Multilingual Mandi MVP

## Overview

This task list breaks down the implementation of a voice-first multilingual platform for mandi price discovery and negotiation.

## Task Breakdown

### Phase 1: Core Infrastructure & Sample Data

#### Task 1.1: Setup Sample Price Dataset
- [ ] Create `src/data/samplePrices.ts` with mock commodity prices
- [ ] Include 8-10 common commodities (onion, tomato, potato, wheat, rice, cotton, sugarcane, pulses)
- [ ] Add price, unit, market name, timestamp, trend data
- [ ] Include commodity icons (emojis)
- [ ] Add multilingual names (English + Hindi minimum)

**Acceptance Criteria:**
- Dataset includes at least 8 commodities
- Each commodity has: name, price, unit, market, timestamp, trend
- Data structure matches `CommodityPrice` interface from design

#### Task 1.2: Create Price Discovery Service
- [ ] Create `src/services/PriceDiscoveryService.ts`
- [ ] Implement `getPrice(commodityName: string)` function
- [ ] Implement `searchCommodity(query: string)` with fuzzy matching
- [ ] Implement `getAllCommodities()` function
- [ ] Add commodity name normalization (handle variations like "onion"/"onions"/"pyaz")

**Acceptance Criteria:**
- Service returns correct price for exact commodity name
- Fuzzy search handles spelling variations
- Returns null for non-existent commodities
- Case-insensitive search

#### Task 1.3: Write Property-Based Tests for Price Service
- [ ] Create `src/tests/PriceDiscovery.property.test.ts`
- [ ] Property: All prices are positive numbers
- [ ] Property: All commodities have valid units ('kg' or 'quintal')
- [ ] Property: Search is case-insensitive
- [ ] Property: Fuzzy search returns most relevant match

**Acceptance Criteria:**
- All property tests pass
- Tests use fast-check library
- Tests validate data integrity

### Phase 2: Voice Recognition & Speech Synthesis

#### Task 2.1: Create Voice Recognition Hook
- [ ] Create `src/hooks/useVoiceRecognition.ts`
- [ ] Implement Web Speech API wrapper
- [ ] Handle browser compatibility checks
- [ ] Return: `{ transcript, isListening, error, startListening, stopListening }`
- [ ] Add language support for Hindi and English initially

**Acceptance Criteria:**
- Hook starts/stops voice recognition
- Returns transcript when speech detected
- Handles errors gracefully (browser not supported, no microphone)
- Works in Chrome and Safari

#### Task 2.2: Create Speech Synthesis Hook
- [ ] Create `src/hooks/useSpeechSynthesis.ts`
- [ ] Implement Web Speech API text-to-speech
- [ ] Support language selection (Hindi, English)
- [ ] Return: `{ speak, isSpeaking, cancel }`
- [ ] Add voice rate and pitch controls

**Acceptance Criteria:**
- Hook speaks provided text in selected language
- Can cancel ongoing speech
- Handles language switching
- Works in Chrome and Safari

#### Task 2.3: Write Property-Based Tests for Voice Hooks
- [ ] Create `src/tests/VoiceInterface.property.test.ts`
- [ ] Property: Voice recognition returns non-empty transcript
- [ ] Property: Speech synthesis accepts any valid string
- [ ] Property: Language codes are valid
- [ ] Mock Web Speech API for testing

**Acceptance Criteria:**
- Tests pass without requiring actual microphone
- Tests validate hook behavior
- Mocks handle edge cases

### Phase 3: UI Components

#### Task 3.1: Create Voice Mic Button Component
- [ ] Create `src/components/VoiceMicButton.tsx`
- [ ] Large circular button (120px diameter)
- [ ] Pulsing animation when listening
- [ ] Visual states: idle, listening, processing, error
- [ ] Haptic feedback on tap (if supported)

**Acceptance Criteria:**
- Button is 120px diameter on mobile
- Shows pulsing animation when active
- Changes color based on state (green idle, red listening)
- Accessible with ARIA labels

#### Task 3.2: Create Price Card Component
- [ ] Create `src/components/PriceCard.tsx`
- [ ] Display commodity icon, name, price
- [ ] Show market name and timestamp
- [ ] Display trend indicator (up/down arrow)
- [ ] Responsive design (mobile-first)

**Acceptance Criteria:**
- Card displays all price information clearly
- Large font for price (48px)
- Trend arrow shows correct direction
- Works on 320px+ screens

#### Task 3.3: Create Language Selector Component
- [ ] Create `src/components/LanguageSelector.tsx`
- [ ] Dropdown or modal with 10 Indian languages
- [ ] Show language names in native script
- [ ] Save selection to localStorage
- [ ] Update UI immediately on change

**Acceptance Criteria:**
- All 10 languages listed (Hindi, English, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada, Malayalam, Punjabi)
- Selection persists across sessions
- UI updates without page reload

#### Task 3.4: Create Header Component
- [ ] Create `src/components/Header.tsx`
- [ ] App name/logo on left
- [ ] Language selector on right
- [ ] Back button (conditional, based on route)
- [ ] Hariyali green theme colors

**Acceptance Criteria:**
- Header is sticky at top
- Language selector accessible
- Back button navigates correctly
- Responsive on all screen sizes

### Phase 4: Home Screen Implementation

#### Task 4.1: Create Home Screen Component
- [ ] Create `src/screens/HomeScreen.tsx`
- [ ] Large centered mic button
- [ ] Collapsible text input field
- [ ] Three quick action buttons (Price, Chat, Help)
- [ ] Recent queries list (optional)

**Acceptance Criteria:**
- Mic button is prominently centered
- Text input expands when tapped
- Quick actions navigate to correct screens
- Layout matches design mockup

#### Task 4.2: Implement Voice Query Processing
- [ ] Add voice recognition to home screen
- [ ] Parse transcript to extract commodity name
- [ ] Handle commands: "price", "check", "what is"
- [ ] Call PriceDiscoveryService with extracted commodity
- [ ] Navigate to result screen with data

**Acceptance Criteria:**
- Recognizes queries like "onion price", "check tomato price"
- Extracts commodity name correctly
- Handles variations in phrasing
- Shows error for unrecognized commodities

#### Task 4.3: Implement Text Query Processing
- [ ] Add text input field to home screen
- [ ] Parse text input to extract commodity
- [ ] Same processing logic as voice
- [ ] Submit on Enter key or button tap

**Acceptance Criteria:**
- Text input works as alternative to voice
- Same parsing logic as voice queries
- Keyboard appears on mobile
- Submit button clearly visible

#### Task 4.4: Write Unit Tests for Home Screen
- [ ] Create `src/tests/HomeScreen.test.tsx`
- [ ] Test mic button click starts voice recognition
- [ ] Test text input submission
- [ ] Test commodity extraction from queries
- [ ] Test navigation to result screen

**Acceptance Criteria:**
- All unit tests pass
- Tests cover main user flows
- Mocks for voice recognition

### Phase 5: Price Result Screen Implementation

#### Task 5.1: Create Price Result Screen Component
- [ ] Create `src/screens/PriceResultScreen.tsx`
- [ ] Display commodity price using PriceCard
- [ ] Show market location and timestamp
- [ ] Add trend indicator
- [ ] Include "Ask Again" button
- [ ] Add "Start Negotiation" button

**Acceptance Criteria:**
- Screen displays all price information
- Back button returns to home
- Buttons are large and tappable
- Layout matches design mockup

#### Task 5.2: Implement Text-to-Speech for Results
- [ ] Add automatic speech on screen load
- [ ] Speak: "Commodity name, price per unit, market name"
- [ ] Add "Speak" button to repeat
- [ ] Use selected language for speech

**Acceptance Criteria:**
- Result is spoken automatically when screen loads
- Speech is in user's selected language
- Can replay speech by tapping button
- Speech is clear and conversational

#### Task 5.3: Add Related Commodities Section
- [ ] Show 2-3 similar commodities with prices
- [ ] Make them tappable to view their details
- [ ] Use simple similarity logic (same category)

**Acceptance Criteria:**
- Shows relevant related commodities
- Tapping navigates to that commodity's result
- At least 2 related items shown

#### Task 5.4: Write Unit Tests for Result Screen
- [ ] Create `src/tests/PriceResultScreen.test.tsx`
- [ ] Test price display
- [ ] Test text-to-speech trigger
- [ ] Test navigation buttons
- [ ] Test related commodities

**Acceptance Criteria:**
- All unit tests pass
- Tests cover main interactions
- Mocks for speech synthesis

### Phase 6: Localization & Translation

#### Task 6.1: Create Localization Service
- [ ] Create `src/services/LocalizationService.ts`
- [ ] Add UI text translations for 10 languages
- [ ] Implement `getText(key: string)` function
- [ ] Add language switching logic
- [ ] Store preference in localStorage

**Acceptance Criteria:**
- Service provides translations for all UI text
- Supports all 10 languages
- Language preference persists
- Fallback to English if translation missing

#### Task 6.2: Create Translation Hook
- [ ] Create `src/hooks/useLocalization.ts`
- [ ] Wrap LocalizationService in React hook
- [ ] Return: `{ t, currentLanguage, changeLanguage }`
- [ ] Trigger re-render on language change

**Acceptance Criteria:**
- Hook provides translation function
- Components re-render on language change
- Easy to use in any component

#### Task 6.3: Apply Translations to All Components
- [ ] Update HomeScreen with translations
- [ ] Update PriceResultScreen with translations
- [ ] Update Header with translations
- [ ] Update all buttons and labels

**Acceptance Criteria:**
- All UI text uses translation keys
- No hardcoded English text
- UI updates immediately on language change

#### Task 6.4: Write Property-Based Tests for Localization
- [ ] Create `src/tests/Localization.property.test.ts`
- [ ] Property: All translation keys return non-empty strings
- [ ] Property: Language switching preserves app state
- [ ] Property: All languages have same set of keys

**Acceptance Criteria:**
- Tests validate translation completeness
- Tests check for missing translations
- All property tests pass

### Phase 7: Styling & Theme

#### Task 7.1: Create Hariyali Theme
- [ ] Create `src/theme/hariyaliTheme.ts`
- [ ] Define color palette (greens, oranges)
- [ ] Set typography (large fonts for readability)
- [ ] Configure MUI theme
- [ ] Add responsive breakpoints

**Acceptance Criteria:**
- Theme uses green as primary color (#4CAF50)
- High contrast for outdoor visibility
- Large font sizes (18px+ body text)
- Matches design color palette

#### Task 7.2: Style Home Screen
- [ ] Apply hariyali theme colors
- [ ] Large touch targets (48px minimum)
- [ ] Proper spacing and padding
- [ ] Responsive layout (320px+)

**Acceptance Criteria:**
- Screen matches design mockup
- All interactive elements are 48px+
- Works on small phones (320px)
- Green theme applied consistently

#### Task 7.3: Style Price Result Screen
- [ ] Apply theme colors
- [ ] Large price display (48px font)
- [ ] Card-based layout
- [ ] Responsive design

**Acceptance Criteria:**
- Screen matches design mockup
- Price is prominently displayed
- Cards have proper shadows/borders
- Responsive on all screen sizes

#### Task 7.4: Add Loading and Error States
- [ ] Create loading spinner component
- [ ] Create error message component
- [ ] Add loading state to voice recognition
- [ ] Add error handling for failed queries

**Acceptance Criteria:**
- Loading spinner shows during processing
- Error messages are clear and helpful
- Errors don't crash the app
- User can retry after error

### Phase 8: Integration & Testing

#### Task 8.1: Integrate All Components
- [ ] Update `src/App.tsx` with routing
- [ ] Connect HomeScreen to PriceResultScreen
- [ ] Add language provider at app level
- [ ] Add voice provider at app level

**Acceptance Criteria:**
- Navigation works between screens
- Language persists across screens
- Voice state is managed globally
- No prop drilling

#### Task 8.2: End-to-End Testing
- [ ] Test complete flow: voice query → result → speech
- [ ] Test complete flow: text query → result → speech
- [ ] Test language switching during flow
- [ ] Test on mobile device (real or emulator)

**Acceptance Criteria:**
- Complete user flows work without errors
- Voice recognition works on mobile
- Text-to-speech works on mobile
- Language switching doesn't break flow

#### Task 8.3: Performance Optimization
- [ ] Lazy load screens
- [ ] Optimize voice recognition startup time
- [ ] Minimize bundle size
- [ ] Add service worker for offline (optional)

**Acceptance Criteria:**
- Initial load < 3 seconds on 3G
- Voice recognition starts < 500ms
- Bundle size < 500KB (gzipped)

#### Task 8.4: Browser Compatibility Testing
- [ ] Test on Chrome Android
- [ ] Test on Safari iOS
- [ ] Test on Firefox Android
- [ ] Add fallbacks for unsupported features

**Acceptance Criteria:**
- Works on Chrome 80+
- Works on Safari 14+
- Graceful degradation if voice not supported
- Clear error messages for unsupported browsers

### Phase 9: Documentation & Demo Preparation

#### Task 9.1: Create README
- [ ] Add project description
- [ ] Add setup instructions
- [ ] Add demo instructions
- [ ] List supported languages and commodities

**Acceptance Criteria:**
- README is clear and complete
- Anyone can run the project
- Demo scenarios documented

#### Task 9.2: Prepare Demo Script
- [ ] Write demo scenarios
- [ ] Test voice commands in Hindi and English
- [ ] Prepare sample queries
- [ ] Document edge cases

**Acceptance Criteria:**
- Demo script covers main features
- Queries work reliably
- Edge cases handled gracefully

#### Task 9.3: Create Demo Video/Screenshots
- [ ] Record demo video (optional)
- [ ] Take screenshots of all screens
- [ ] Show voice interaction
- [ ] Show language switching

**Acceptance Criteria:**
- Visual documentation of features
- Shows voice-first interaction
- Demonstrates multilingual support

## Task Dependencies

```
Phase 1 (Data & Services)
  ↓
Phase 2 (Voice Hooks)
  ↓
Phase 3 (UI Components)
  ↓
Phase 4 (Home Screen) ← Phase 6 (Localization)
  ↓
Phase 5 (Result Screen)
  ↓
Phase 7 (Styling)
  ↓
Phase 8 (Integration)
  ↓
Phase 9 (Documentation)
```

## Priority Order

**High Priority (MVP Core):**
- Task 1.1, 1.2: Sample data and price service
- Task 2.1, 2.2: Voice recognition and speech synthesis
- Task 4.1, 4.2, 4.3: Home screen with voice/text input
- Task 5.1, 5.2: Price result screen with speech
- Task 7.1, 7.2, 7.3: Basic styling

**Medium Priority (Polish):**
- Task 3.1, 3.2, 3.3: Reusable components
- Task 6.1, 6.2, 6.3: Full localization
- Task 7.4: Loading and error states
- Task 8.1, 8.2: Integration testing

**Low Priority (Nice-to-Have):**
- Task 1.3, 2.3, 4.4, 5.4, 6.4: Property-based tests
- Task 5.3: Related commodities
- Task 8.3: Performance optimization
- Task 9.1, 9.2, 9.3: Documentation

## Estimated Timeline

- **Phase 1-2**: 2-3 hours (Core services and voice)
- **Phase 3-5**: 3-4 hours (UI components and screens)
- **Phase 6-7**: 2-3 hours (Localization and styling)
- **Phase 8-9**: 2-3 hours (Integration and polish)

**Total**: 9-13 hours for complete MVP

## Success Criteria

The MVP is complete when:
1. ✅ User can ask for commodity prices using voice (Hindi/English)
2. ✅ User can type commodity queries as alternative
3. ✅ System detects commodity name from query
4. ✅ System returns price from sample dataset
5. ✅ System speaks the result conversationally
6. ✅ UI is mobile-friendly with large buttons
7. ✅ Hariyali green theme applied throughout
8. ✅ Works on Chrome and Safari mobile browsers
