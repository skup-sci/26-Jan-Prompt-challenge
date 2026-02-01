/**
 * Localization Service for Multilingual Mandi Platform
 * 
 * Provides UI localization for 10+ Indian languages with dynamic text translation
 * and cultural context preservation.
 */

import { LanguageCode, SUPPORTED_LANGUAGES } from './TranslationService';

// UI text translations for all supported languages
const UI_TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.prices': 'Prices',
    'nav.negotiate': 'Negotiate',
    'nav.profile': 'Profile',
    
    // Common actions
    'action.search': 'Search',
    'action.submit': 'Submit',
    'action.cancel': 'Cancel',
    'action.save': 'Save',
    'action.delete': 'Delete',
    'action.edit': 'Edit',
    
    // Price discovery
    'price.title': 'Price Discovery',
    'price.commodity': 'Commodity',
    'price.quantity': 'Quantity',
    'price.location': 'Location',
    'price.getPrice': 'Get Price',
    'price.recommendation': 'Recommended Price',
    
    // Negotiation
    'negotiate.title': 'Negotiation Assistant',
    'negotiate.offer': 'Make Offer',
    'negotiate.counter': 'Counter Offer',
    'negotiate.accept': 'Accept',
    'negotiate.reject': 'Reject',
    
    // Settings
    'settings.language': 'Language',
    'settings.selectLanguage': 'Select Language',
    
    // Messages
    'message.loading': 'Loading...',
    'message.error': 'An error occurred',
    'message.success': 'Success',
    'message.welcome': 'Welcome to Mandi Platform',
    
    // Voice Interface
    'voice.assistant': 'Voice-First Trading Assistant',
    'voice.startCommand': 'Start Voice Command',
    'voice.stopListening': 'Stop Listening',
    'voice.youSaid': 'You said:',
    'voice.assistantResponse': 'Assistant Response:',
    'voice.supportedFeatures': 'Supported Features: Voice Commands • Price Discovery • Translation • Negotiation',
    'voice.notSupported': 'Voice recognition is not supported in your browser',
  },
  hi: {
    // Navigation
    'nav.home': 'होम',
    'nav.prices': 'मूल्य',
    'nav.negotiate': 'बातचीत',
    'nav.profile': 'प्रोफ़ाइल',
    
    // Common actions
    'action.search': 'खोजें',
    'action.submit': 'जमा करें',
    'action.cancel': 'रद्द करें',
    'action.save': 'सहेजें',
    'action.delete': 'हटाएं',
    'action.edit': 'संपादित करें',
    
    // Price discovery
    'price.title': 'मूल्य खोज',
    'price.commodity': 'वस्तु',
    'price.quantity': 'मात्रा',
    'price.location': 'स्थान',
    'price.getPrice': 'मूल्य प्राप्त करें',
    'price.recommendation': 'अनुशंसित मूल्य',
    
    // Negotiation
    'negotiate.title': 'बातचीत सहायक',
    'negotiate.offer': 'प्रस्ताव दें',
    'negotiate.counter': 'प्रति प्रस्ताव',
    'negotiate.accept': 'स्वीकार करें',
    'negotiate.reject': 'अस्वीकार करें',
    
    // Settings
    'settings.language': 'भाषा',
    'settings.selectLanguage': 'भाषा चुनें',
    
    // Messages
    'message.loading': 'लोड हो रहा है...',
    'message.error': 'एक त्रुटि हुई',
    'message.success': 'सफलता',
    'message.welcome': 'मंडी प्लेटफॉर्म में आपका स्वागत है',
    
    // Voice Interface
    'voice.assistant': 'वॉयस-फर्स्ट ट्रेडिंग सहायक',
    'voice.startCommand': 'वॉयस कमांड शुरू करें',
    'voice.stopListening': 'सुनना बंद करें',
    'voice.youSaid': 'आपने कहा:',
    'voice.assistantResponse': 'सहायक प्रतिक्रिया:',
    'voice.supportedFeatures': 'समर्थित सुविधाएं: वॉयस कमांड • मूल्य खोज • अनुवाद • बातचीत',
    'voice.notSupported': 'आपके ब्राउज़र में वॉयस पहचान समर्थित नहीं है',
  },
  ta: {
    // Navigation
    'nav.home': 'முகப்பு',
    'nav.prices': 'விலைகள்',
    'nav.negotiate': 'பேச்சுவார்த்தை',
    'nav.profile': 'சுயவிவரம்',
    
    // Common actions
    'action.search': 'தேடு',
    'action.submit': 'சமர்ப்பிக்கவும்',
    'action.cancel': 'ரத்து செய்',
    'action.save': 'சேமி',
    'action.delete': 'நீக்கு',
    'action.edit': 'திருத்து',
    
    // Price discovery
    'price.title': 'விலை கண்டுபிடிப்பு',
    'price.commodity': 'பொருள்',
    'price.quantity': 'அளவு',
    'price.location': 'இடம்',
    'price.getPrice': 'விலை பெறு',
    'price.recommendation': 'பரிந்துரைக்கப்பட்ட விலை',
    
    // Negotiation
    'negotiate.title': 'பேச்சுவார்த்தை உதவியாளர்',
    'negotiate.offer': 'சலுகை செய்',
    'negotiate.counter': 'எதிர் சலுகை',
    'negotiate.accept': 'ஏற்கவும்',
    'negotiate.reject': 'நிராகரி',
    
    // Settings
    'settings.language': 'மொழி',
    'settings.selectLanguage': 'மொழியைத் தேர்ந்தெடுக்கவும்',
    
    // Messages
    'message.loading': 'ஏற்றுகிறது...',
    'message.error': 'பிழை ஏற்பட்டது',
    'message.success': 'வெற்றி',
    'message.welcome': 'மண்டி தளத்திற்கு வரவேற்கிறோம்',
    
    // Voice Interface
    'voice.assistant': 'குரல்-முதல் வர்த்தக உதவியாளர்',
    'voice.startCommand': 'குரல் கட்டளையைத் தொடங்கவும்',
    'voice.stopListening': 'கேட்பதை நிறுத்து',
    'voice.youSaid': 'நீங்கள் சொன்னீர்கள்:',
    'voice.assistantResponse': 'உதவியாளர் பதில்:',
    'voice.supportedFeatures': 'ஆதரிக்கப்படும் அம்சங்கள்: குரல் கட்டளைகள் • விலை கண்டுபிடிப்பு • மொழிபெயர்ப்பு • பேச்சுவார்த்தை',
    'voice.notSupported': 'உங்கள் உலாவியில் குரல் அங்கீகாரம் ஆதரிக்கப்படவில்லை',
  },
  te: {
    // Navigation
    'nav.home': 'హోమ్',
    'nav.prices': 'ధరలు',
    'nav.negotiate': 'చర్చలు',
    'nav.profile': 'ప్రొఫైల్',
    
    // Common actions
    'action.search': 'వెతకండి',
    'action.submit': 'సమర్పించండి',
    'action.cancel': 'రద్దు చేయండి',
    'action.save': 'సేవ్ చేయండి',
    'action.delete': 'తొలగించండి',
    'action.edit': 'సవరించండి',
    
    // Price discovery
    'price.title': 'ధర కనుగొనడం',
    'price.commodity': 'వస్తువు',
    'price.quantity': 'పరిమాణం',
    'price.location': 'స్థానం',
    'price.getPrice': 'ధర పొందండి',
    'price.recommendation': 'సిఫార్సు చేయబడిన ధర',
    
    // Negotiation
    'negotiate.title': 'చర్చల సహాయకుడు',
    'negotiate.offer': 'ఆఫర్ చేయండి',
    'negotiate.counter': 'కౌంటర్ ఆఫర్',
    'negotiate.accept': 'అంగీకరించండి',
    'negotiate.reject': 'తిరస్కరించండి',
    
    // Settings
    'settings.language': 'భాష',
    'settings.selectLanguage': 'భాషను ఎంచుకోండి',
    
    // Messages
    'message.loading': 'లోడ్ అవుతోంది...',
    'message.error': 'లోపం సంభవించింది',
    'message.success': 'విజయం',
    'message.welcome': 'మండి ప్లాట్‌ఫారమ్‌కు స్వాగతం',
    
    // Voice Interface
    'voice.assistant': 'వాయిస్-ఫస్ట్ ట్రేడింగ్ అసిస్టెంట్',
    'voice.startCommand': 'వాయిస్ కమాండ్ ప్రారంభించండి',
    'voice.stopListening': 'వినడం ఆపండి',
    'voice.youSaid': 'మీరు చెప్పారు:',
    'voice.assistantResponse': 'అసిస్టెంట్ ప్రతిస్పందన:',
    'voice.supportedFeatures': 'మద్దతు ఉన్న ఫీచర్లు: వాయిస్ కమాండ్స్ • ధర కనుగొనడం • అనువాదం • చర్చలు',
    'voice.notSupported': 'మీ బ్రౌజర్‌లో వాయిస్ రికగ్నిషన్ మద్దతు లేదు',
  },
  bn: {
    // Navigation
    'nav.home': 'হোম',
    'nav.prices': 'দাম',
    'nav.negotiate': 'আলোচনা',
    'nav.profile': 'প্রোফাইল',
    
    // Common actions
    'action.search': 'অনুসন্ধান',
    'action.submit': 'জমা দিন',
    'action.cancel': 'বাতিল',
    'action.save': 'সংরক্ষণ',
    'action.delete': 'মুছুন',
    'action.edit': 'সম্পাদনা',
    
    // Price discovery
    'price.title': 'মূল্য আবিষ্কার',
    'price.commodity': 'পণ্য',
    'price.quantity': 'পরিমাণ',
    'price.location': 'অবস্থান',
    'price.getPrice': 'মূল্য পান',
    'price.recommendation': 'প্রস্তাবিত মূল্য',
    
    // Negotiation
    'negotiate.title': 'আলোচনা সহায়ক',
    'negotiate.offer': 'অফার করুন',
    'negotiate.counter': 'পাল্টা অফার',
    'negotiate.accept': 'গ্রহণ করুন',
    'negotiate.reject': 'প্রত্যাখ্যান',
    
    // Settings
    'settings.language': 'ভাষা',
    'settings.selectLanguage': 'ভাষা নির্বাচন করুন',
    
    // Messages
    'message.loading': 'লোড হচ্ছে...',
    'message.error': 'একটি ত্রুটি ঘটেছে',
    'message.success': 'সফলতা',
    'message.welcome': 'মান্ডি প্ল্যাটফর্মে স্বাগতম',
    
    // Voice Interface
    'voice.assistant': 'ভয়েস-ফার্স্ট ট্রেডিং সহায়ক',
    'voice.startCommand': 'ভয়েস কমান্ড শুরু করুন',
    'voice.stopListening': 'শোনা বন্ধ করুন',
    'voice.youSaid': 'আপনি বলেছেন:',
    'voice.assistantResponse': 'সহায়ক প্রতিক্রিয়া:',
    'voice.supportedFeatures': 'সমর্থিত বৈশিষ্ট্য: ভয়েস কমান্ড • মূল্য আবিষ্কার • অনুবাদ • আলোচনা',
    'voice.notSupported': 'আপনার ব্রাউজারে ভয়েস রিকগনিশন সমর্থিত নয়',
  },
  mr: {
    // Navigation
    'nav.home': 'मुख्यपृष्ठ',
    'nav.prices': 'किंमती',
    'nav.negotiate': 'वाटाघाटी',
    'nav.profile': 'प्रोफाइल',
    
    // Common actions
    'action.search': 'शोधा',
    'action.submit': 'सबमिट करा',
    'action.cancel': 'रद्द करा',
    'action.save': 'जतन करा',
    'action.delete': 'हटवा',
    'action.edit': 'संपादित करा',
    
    // Price discovery
    'price.title': 'किंमत शोध',
    'price.commodity': 'वस्तू',
    'price.quantity': 'प्रमाण',
    'price.location': 'स्थान',
    'price.getPrice': 'किंमत मिळवा',
    'price.recommendation': 'शिफारस केलेली किंमत',
    
    // Negotiation
    'negotiate.title': 'वाटाघाटी सहाय्यक',
    'negotiate.offer': 'ऑफर द्या',
    'negotiate.counter': 'प्रति ऑफर',
    'negotiate.accept': 'स्वीकारा',
    'negotiate.reject': 'नाकारा',
    
    // Settings
    'settings.language': 'भाषा',
    'settings.selectLanguage': 'भाषा निवडा',
    
    // Messages
    'message.loading': 'लोड होत आहे...',
    'message.error': 'त्रुटी आली',
    'message.success': 'यश',
    'message.welcome': 'मंडी प्लॅटफॉर्मवर स्वागत आहे',
    
    // Voice Interface
    'voice.assistant': 'व्हॉइस-फर्स्ट ट्रेडिंग सहाय्यक',
    'voice.startCommand': 'व्हॉइस कमांड सुरू करा',
    'voice.stopListening': 'ऐकणे थांबवा',
    'voice.youSaid': 'तुम्ही म्हणालात:',
    'voice.assistantResponse': 'सहाय्यक प्रतिसाद:',
    'voice.supportedFeatures': 'समर्थित वैशिष्ट्ये: व्हॉइस कमांड • किंमत शोध • भाषांतर • वाटाघाटी',
    'voice.notSupported': 'तुमच्या ब्राउझरमध्ये व्हॉइस रिकग्निशन समर्थित नाही',
  },
  gu: {
    // Navigation
    'nav.home': 'હોમ',
    'nav.prices': 'ભાવ',
    'nav.negotiate': 'વાટાઘાટ',
    'nav.profile': 'પ્રોફાઇલ',
    
    // Common actions
    'action.search': 'શોધો',
    'action.submit': 'સબમિટ કરો',
    'action.cancel': 'રદ કરો',
    'action.save': 'સાચવો',
    'action.delete': 'કાઢી નાખો',
    'action.edit': 'સંપાદિત કરો',
    
    // Price discovery
    'price.title': 'ભાવ શોધ',
    'price.commodity': 'વસ્તુ',
    'price.quantity': 'જથ્થો',
    'price.location': 'સ્થાન',
    'price.getPrice': 'ભાવ મેળવો',
    'price.recommendation': 'ભલામણ કરેલ ભાવ',
    
    // Negotiation
    'negotiate.title': 'વાટાઘાટ સહાયક',
    'negotiate.offer': 'ઓફર કરો',
    'negotiate.counter': 'કાઉન્ટર ઓફર',
    'negotiate.accept': 'સ્વીકારો',
    'negotiate.reject': 'નકારો',
    
    // Settings
    'settings.language': 'ભાષા',
    'settings.selectLanguage': 'ભાષા પસંદ કરો',
    
    // Messages
    'message.loading': 'લોડ થઈ રહ્યું છે...',
    'message.error': 'ભૂલ આવી',
    'message.success': 'સફળતા',
    'message.welcome': 'મંડી પ્લેટફોર્મમાં આપનું સ્વાગત છે',
    
    // Voice Interface
    'voice.assistant': 'વૉઇસ-ફર્સ્ટ ટ્રેડિંગ સહાયક',
    'voice.startCommand': 'વૉઇસ કમાન્ડ શરૂ કરો',
    'voice.stopListening': 'સાંભળવાનું બંધ કરો',
    'voice.youSaid': 'તમે કહ્યું:',
    'voice.assistantResponse': 'સહાયક પ્રતિસાદ:',
    'voice.supportedFeatures': 'સમર્થિત સુવિધાઓ: વૉઇસ કમાન્ડ • ભાવ શોધ • અનુવાદ • વાટાઘાટ',
    'voice.notSupported': 'તમારા બ્રાઉઝરમાં વૉઇસ રિકગ્નિશન સપોર્ટેડ નથી',
  },
  kn: {
    // Navigation
    'nav.home': 'ಮುಖಪುಟ',
    'nav.prices': 'ಬೆಲೆಗಳು',
    'nav.negotiate': 'ಮಾತುಕತೆ',
    'nav.profile': 'ಪ್ರೊಫೈಲ್',
    
    // Common actions
    'action.search': 'ಹುಡುಕಿ',
    'action.submit': 'ಸಲ್ಲಿಸಿ',
    'action.cancel': 'ರದ್ದುಮಾಡಿ',
    'action.save': 'ಉಳಿಸಿ',
    'action.delete': 'ಅಳಿಸಿ',
    'action.edit': 'ಸಂಪಾದಿಸಿ',
    
    // Price discovery
    'price.title': 'ಬೆಲೆ ಶೋಧನೆ',
    'price.commodity': 'ಸರಕು',
    'price.quantity': 'ಪ್ರಮಾಣ',
    'price.location': 'ಸ್ಥಳ',
    'price.getPrice': 'ಬೆಲೆ ಪಡೆಯಿರಿ',
    'price.recommendation': 'ಶಿಫಾರಸು ಮಾಡಿದ ಬೆಲೆ',
    
    // Negotiation
    'negotiate.title': 'ಮಾತುಕತೆ ಸಹಾಯಕ',
    'negotiate.offer': 'ಆಫರ್ ಮಾಡಿ',
    'negotiate.counter': 'ಕೌಂಟರ್ ಆಫರ್',
    'negotiate.accept': 'ಸ್ವೀಕರಿಸಿ',
    'negotiate.reject': 'ತಿರಸ್ಕರಿಸಿ',
    
    // Settings
    'settings.language': 'ಭಾಷೆ',
    'settings.selectLanguage': 'ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ',
    
    // Messages
    'message.loading': 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...',
    'message.error': 'ದೋಷ ಸಂಭವಿಸಿದೆ',
    'message.success': 'ಯಶಸ್ಸು',
    'message.welcome': 'ಮಂಡಿ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್‌ಗೆ ಸ್ವಾಗತ',
    
    // Voice Interface
    'voice.assistant': 'ವಾಯ್ಸ್-ಫರ್ಸ್ಟ್ ಟ್ರೇಡಿಂಗ್ ಸಹಾಯಕ',
    'voice.startCommand': 'ವಾಯ್ಸ್ ಕಮಾಂಡ್ ಪ್ರಾರಂಭಿಸಿ',
    'voice.stopListening': 'ಕೇಳುವುದನ್ನು ನಿಲ್ಲಿಸಿ',
    'voice.youSaid': 'ನೀವು ಹೇಳಿದ್ದು:',
    'voice.assistantResponse': 'ಸಹಾಯಕ ಪ್ರತಿಕ್ರಿಯೆ:',
    'voice.supportedFeatures': 'ಬೆಂಬಲಿತ ವೈಶಿಷ್ಟ್ಯಗಳು: ವಾಯ್ಸ್ ಕಮಾಂಡ್ಸ್ • ಬೆಲೆ ಶೋಧನೆ • ಅನುವಾದ • ಮಾತುಕತೆ',
    'voice.notSupported': 'ನಿಮ್ಮ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ವಾಯ್ಸ್ ರೆಕಗ್ನಿಷನ್ ಬೆಂಬಲಿತವಾಗಿಲ್ಲ',
  },
  ml: {
    // Navigation
    'nav.home': 'ഹോം',
    'nav.prices': 'വിലകൾ',
    'nav.negotiate': 'ചർച്ച',
    'nav.profile': 'പ്രൊഫൈൽ',
    
    // Common actions
    'action.search': 'തിരയുക',
    'action.submit': 'സമർപ്പിക്കുക',
    'action.cancel': 'റദ്ദാക്കുക',
    'action.save': 'സംരക്ഷിക്കുക',
    'action.delete': 'ഇല്ലാതാക്കുക',
    'action.edit': 'എഡിറ്റ് ചെയ്യുക',
    
    // Price discovery
    'price.title': 'വില കണ്ടെത്തൽ',
    'price.commodity': 'ചരക്ക്',
    'price.quantity': 'അളവ്',
    'price.location': 'സ്ഥലം',
    'price.getPrice': 'വില നേടുക',
    'price.recommendation': 'ശുപാർശ ചെയ്ത വില',
    
    // Negotiation
    'negotiate.title': 'ചർച്ച സഹായി',
    'negotiate.offer': 'ഓഫർ നൽകുക',
    'negotiate.counter': 'കൗണ്ടർ ഓഫർ',
    'negotiate.accept': 'സ്വീകരിക്കുക',
    'negotiate.reject': 'നിരസിക്കുക',
    
    // Settings
    'settings.language': 'ഭാഷ',
    'settings.selectLanguage': 'ഭാഷ തിരഞ്ഞെടുക്കുക',
    
    // Messages
    'message.loading': 'ലോഡ് ചെയ്യുന്നു...',
    'message.error': 'പിശക് സംഭവിച്ചു',
    'message.success': 'വിജയം',
    'message.welcome': 'മണ്ടി പ്ലാറ്റ്ഫോമിലേക്ക് സ്വാഗതം',
    
    // Voice Interface
    'voice.assistant': 'വോയ്സ്-ഫസ്റ്റ് ട്രേഡിംഗ് അസിസ്റ്റന്റ്',
    'voice.startCommand': 'വോയ്സ് കമാൻഡ് ആരംഭിക്കുക',
    'voice.stopListening': 'കേൾക്കുന്നത് നിർത്തുക',
    'voice.youSaid': 'നിങ്ങൾ പറഞ്ഞു:',
    'voice.assistantResponse': 'അസിസ്റ്റന്റ് പ്രതികരണം:',
    'voice.supportedFeatures': 'പിന്തുണയ്ക്കുന്ന സവിശേഷതകൾ: വോയ്സ് കമാൻഡുകൾ • വില കണ്ടെത്തൽ • വിവർത്തനം • ചർച്ച',
    'voice.notSupported': 'നിങ്ങളുടെ ബ്രൗസറിൽ വോയ്സ് റെക്കഗ്നിഷൻ പിന്തുണയ്ക്കുന്നില്ല',
  },
  pa: {
    // Navigation
    'nav.home': 'ਹੋਮ',
    'nav.prices': 'ਕੀਮਤਾਂ',
    'nav.negotiate': 'ਗੱਲਬਾਤ',
    'nav.profile': 'ਪ੍ਰੋਫਾਈਲ',
    
    // Common actions
    'action.search': 'ਖੋਜੋ',
    'action.submit': 'ਜਮ੍ਹਾਂ ਕਰੋ',
    'action.cancel': 'ਰੱਦ ਕਰੋ',
    'action.save': 'ਸੁਰੱਖਿਅਤ ਕਰੋ',
    'action.delete': 'ਮਿਟਾਓ',
    'action.edit': 'ਸੰਪਾਦਿਤ ਕਰੋ',
    
    // Price discovery
    'price.title': 'ਕੀਮਤ ਖੋਜ',
    'price.commodity': 'ਵਸਤੂ',
    'price.quantity': 'ਮਾਤਰਾ',
    'price.location': 'ਸਥਾਨ',
    'price.getPrice': 'ਕੀਮਤ ਪ੍ਰਾਪਤ ਕਰੋ',
    'price.recommendation': 'ਸਿਫਾਰਸ਼ ਕੀਤੀ ਕੀਮਤ',
    
    // Negotiation
    'negotiate.title': 'ਗੱਲਬਾਤ ਸਹਾਇਕ',
    'negotiate.offer': 'ਪੇਸ਼ਕਸ਼ ਕਰੋ',
    'negotiate.counter': 'ਕਾਊਂਟਰ ਪੇਸ਼ਕਸ਼',
    'negotiate.accept': 'ਸਵੀਕਾਰ ਕਰੋ',
    'negotiate.reject': 'ਅਸਵੀਕਾਰ ਕਰੋ',
    
    // Settings
    'settings.language': 'ਭਾਸ਼ਾ',
    'settings.selectLanguage': 'ਭਾਸ਼ਾ ਚੁਣੋ',
    
    // Messages
    'message.loading': 'ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...',
    'message.error': 'ਇੱਕ ਗਲਤੀ ਆਈ',
    'message.success': 'ਸਫਲਤਾ',
    'message.welcome': 'ਮੰਡੀ ਪਲੇਟਫਾਰਮ ਵਿੱਚ ਤੁਹਾਡਾ ਸਵਾਗਤ ਹੈ',
    
    // Voice Interface
    'voice.assistant': 'ਵੌਇਸ-ਫਰਸਟ ਟ੍ਰੇਡਿੰਗ ਸਹਾਇਕ',
    'voice.startCommand': 'ਵੌਇਸ ਕਮਾਂਡ ਸ਼ੁਰੂ ਕਰੋ',
    'voice.stopListening': 'ਸੁਣਨਾ ਬੰਦ ਕਰੋ',
    'voice.youSaid': 'ਤੁਸੀਂ ਕਿਹਾ:',
    'voice.assistantResponse': 'ਸਹਾਇਕ ਜਵਾਬ:',
    'voice.supportedFeatures': 'ਸਮਰਥਿਤ ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ: ਵੌਇਸ ਕਮਾਂਡ • ਕੀਮਤ ਖੋਜ • ਅਨੁਵਾਦ • ਗੱਲਬਾਤ',
    'voice.notSupported': 'ਤੁਹਾਡੇ ਬ੍ਰਾਊਜ਼ਰ ਵਿੱਚ ਵੌਇਸ ਰਿਕਗਨੀਸ਼ਨ ਸਮਰਥਿਤ ਨਹੀਂ ਹੈ',
  },
};

class LocalizationService {
  private currentLanguage: LanguageCode;
  private readonly STORAGE_KEY = 'mandi_preferred_language';

  constructor() {
    // Load preferred language from storage or default to English
    const stored = localStorage.getItem(this.STORAGE_KEY);
    this.currentLanguage = (stored as LanguageCode) || 'en';
  }

  /**
   * Get the current selected language
   */
  getCurrentLanguage(): LanguageCode {
    return this.currentLanguage;
  }

  /**
   * Set the current language
   * @param language - Language code to set
   */
  setLanguage(language: LanguageCode): void {
    if (!SUPPORTED_LANGUAGES[language]) {
      console.warn(`Unsupported language: ${language}. Defaulting to English.`);
      this.currentLanguage = 'en';
    } else {
      this.currentLanguage = language;
      localStorage.setItem(this.STORAGE_KEY, language);
    }
  }

  /**
   * Get translated text for a key
   * @param key - Translation key (e.g., 'nav.home')
   * @param fallback - Optional fallback text if key not found
   * @returns Translated text
   */
  getText(key: string, fallback?: string): string {
    const translations = UI_TRANSLATIONS[this.currentLanguage];
    
    if (!translations) {
      console.warn(`No translations found for language: ${this.currentLanguage}`);
      return fallback || key;
    }

    const text = translations[key];
    if (!text) {
      console.warn(`Translation key not found: ${key}`);
      return fallback || key;
    }

    return text;
  }

  /**
   * Get all available languages
   */
  getAvailableLanguages(): Array<{ code: LanguageCode; name: string }> {
    return Object.entries(SUPPORTED_LANGUAGES).map(([code, name]) => ({
      code: code as LanguageCode,
      name,
    }));
  }

  /**
   * Get language name for a code
   */
  getLanguageName(code: LanguageCode): string {
    return SUPPORTED_LANGUAGES[code] || code;
  }

  /**
   * Check if a language is supported
   */
  isLanguageSupported(code: string): boolean {
    return code in SUPPORTED_LANGUAGES;
  }
}

// Export singleton instance
export const localizationService = new LocalizationService();
export default LocalizationService;
