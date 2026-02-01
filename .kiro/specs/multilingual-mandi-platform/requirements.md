# Requirements Document - Multilingual Mandi (Hackathon MVP)

## Introduction

A simple voice-first web platform for local vendors in Indian markets to check commodity prices and negotiate across language barriers. This is a hackathon MVP focused on demonstrating core multilingual and AI-assisted trading features.

## MVP Scope

**INCLUDED:**
- Multilingual translation between vendors
- AI-based price discovery using sample data
- Negotiation assistance
- Voice and text input
- Mobile-friendly UI

**EXCLUDED:**
- Login/authentication systems
- Trust scores or ratings
- Identity verification
- Complex security compliance
- Long-term analytics or reporting

## Glossary

- **Vendor**: Local trader in Indian markets
- **Mandi**: Indian agricultural marketplace
- **Voice_Interface**: Speech recognition and text-to-speech system
- **Translation_Service**: Real-time language translation
- **Price_Discovery**: Commodity price lookup using sample data
- **Negotiation_Assistant**: AI guidance for price negotiations

## Requirements

### Requirement 1: Multilingual UI and Translation

**User Story:** As a vendor who speaks a regional language, I want the app in my language and to communicate with vendors who speak different languages, so that language is not a barrier to trade.

#### Acceptance Criteria

1. THE app SHALL support 10 Indian languages: Hindi, English, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada, Malayalam, and Punjabi
2. WHEN a vendor selects a language, ALL UI elements SHALL display in that language immediately
3. WHEN a vendor sends a message, THE Translation_Service SHALL translate it to the recipient's language within 2 seconds
4. THE Translation_Service SHALL preserve numbers, commodity names, and pricing terms accurately
5. THE app SHALL remember language preference in browser storage (no login required)

### Requirement 2: Voice and Text Input

**User Story:** As a vendor with varying digital literacy, I want to use voice or text to interact with the app, so that I can choose the easiest method for me.

#### Acceptance Criteria

1. THE Voice_Interface SHALL provide a large microphone button that starts/stops voice recognition
2. WHEN voice input is active, THE app SHALL show visual feedback (pulsing animation, "Listening..." text)
3. THE Voice_Interface SHALL recognize speech in the selected language and convert to text within 2 seconds
4. THE app SHALL also provide text input fields as an alternative to voice
5. WHEN the app responds, IT SHALL speak the response using text-to-speech in the vendor's language

### Requirement 3: AI-Based Price Discovery

**User Story:** As a vendor, I want to quickly check current market prices for commodities, so that I know fair prices before negotiating.

#### Acceptance Criteria

1. THE Price_Discovery SHALL support common commodities: wheat, rice, onion, tomato, potato, cotton, sugarcane, pulses
2. WHEN a vendor asks for a price (voice or text), THE Price_Discovery SHALL return a price within 3 seconds
3. THE Price_Discovery SHALL display: commodity name, price per kg/quintal, and market name
4. THE Price_Discovery SHALL use sample/mock data (no real API integration required for MVP)
5. WHEN a commodity is not found, THE Price_Discovery SHALL suggest similar available commodities

### Requirement 4: Negotiation Assistance

**User Story:** As a vendor negotiating a deal, I want AI suggestions on offers and counter-offers, so that I can make better trading decisions.

#### Acceptance Criteria

1. WHEN a vendor starts negotiation, THE Negotiation_Assistant SHALL ask for commodity and initial offer
2. THE Negotiation_Assistant SHALL compare offers against sample market prices and provide advice: "Good deal", "Too high", "Counter with ₹X"
3. THE Negotiation_Assistant SHALL provide 2-3 simple suggestions per negotiation turn
4. THE Negotiation_Assistant SHALL use simple, non-technical language appropriate for vendors
5. THE Negotiation_Assistant SHALL work in the vendor's selected language

### Requirement 5: Mobile-First, Simple UI

**User Story:** As a vendor using a smartphone in the market, I want a simple interface with large buttons and clear icons, so that I can use it easily even in bright sunlight or crowded conditions.

#### Acceptance Criteria

1. THE app SHALL use a green (hariyali) agricultural theme with high contrast
2. ALL interactive elements SHALL be at least 48px in size for easy tapping
3. THE app SHALL use icons with text labels to aid understanding
4. THE app SHALL be fully responsive from 320px (small phones) to 1920px (desktop) width
5. THE app SHALL have no more than 3 main screens: Voice Assistant, Price Check, Negotiation

### Requirement 6: Simple Vendor-to-Vendor Communication

**User Story:** As a vendor, I want to send simple messages to other vendors in my language and have them automatically translated, so that we can negotiate across language barriers.

#### Acceptance Criteria

1. THE app SHALL provide a simple chat interface for vendor-to-vendor messages
2. WHEN a message is sent, THE app SHALL show both original and translated versions
3. THE app SHALL translate messages between any two of the 10 supported languages
4. THE app SHALL support both voice and text message input
5. THE app SHALL NOT require login - vendors can start chatting immediately (demo mode)

## Non-Functional Requirements

### Performance
- Page load time: < 5 seconds on 3G
- Translation response: < 2 seconds
- Voice recognition: < 2 seconds
- Price lookup: < 3 seconds

### Usability
- Large touch targets (min 48px)
- High contrast colors for outdoor visibility
- Simple navigation (max 3 taps to any feature)
- Minimal text, icon-driven interface

### Compatibility
- Modern mobile browsers (Chrome, Safari, Firefox)
- Web Speech API support for voice features
- Responsive design (320px - 1920px)

### Data
- Sample/mock data for prices (no real API needed)
- Browser localStorage for preferences (no database)
- No user accounts or authentication
