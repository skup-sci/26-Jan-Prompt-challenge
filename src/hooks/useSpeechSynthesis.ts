import { useState, useEffect, useCallback } from 'react';
import { SUPPORTED_LANGUAGES } from '../services/TranslationService';

export const useSpeechSynthesis = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    // Check if speech synthesis is supported
    if ('speechSynthesis' in window) {
      setIsSupported(true);
      
      // Load available voices, filtered to local supported languages only
      const loadVoices = () => {
        const allVoices = speechSynthesis.getVoices();

        // Allowed primary language prefixes from SUPPORTED_LANGUAGES + 'en'
        const allowedPrefixes = new Set([...Object.keys(SUPPORTED_LANGUAGES), 'en']);

        // Helper: additional name matches (including native script labels)
        const LANGUAGE_NAME_MATCHES: Record<string, string[]> = {
          hi: ['hindi', 'हिन्दी', 'हिंदी'],
          ta: ['tamil', 'தமிழ்'],
          te: ['telugu', 'తెలుగు'],
          bn: ['bengali', 'বাংলা'],
          mr: ['marathi', 'मराठी'],
          gu: ['gujarati', 'ગુજરાતી'],
          kn: ['kannada', 'ಕನ್ನಡ'],
          ml: ['malayalam', 'മലയാളം'],
          pa: ['punjabi', 'ਪੰਜਾਬੀ', 'ਮਾਤ੍ਰਿਕਾ'],
          en: ['english']
        };

        // Script detection (name contains script characters)
        const scriptToLang = [
          { regex: /[\u0900-\u097F]/, code: 'hi' },   // Devanagari (Hindi, Marathi)
          { regex: /[\u0B80-\u0BFF]/, code: 'ta' },   // Tamil
          { regex: /[\u0C00-\u0C7F]/, code: 'te' },   // Telugu
          { regex: /[\u0980-\u09FF]/, code: 'bn' },   // Bengali
          { regex: /[\u0A80-\u0AFF]/, code: 'gu' },   // Gujarati
          { regex: /[\u0C80-\u0CFF]/, code: 'kn' },   // Kannada
          { regex: /[\u0D00-\u0D7F]/, code: 'ml' },   // Malayalam
          { regex: /[\u0A00-\u0A7F]/, code: 'pa' },   // Gurmukhi (Punjabi)
        ];

        // First pass: match by language code in voice.lang
        let availableVoices = allVoices.filter(v => {
          const lang = (v.lang || '').toLowerCase();
          const primary = lang.split('-')[0];
          return allowedPrefixes.has(primary) || allowedPrefixes.has(lang);
        });

        // Second pass: if none found, try matching by voice.name using language name matches or script
        if (availableVoices.length === 0) {
          const lcName = (name: string) => (name || '').toLowerCase();

          availableVoices = allVoices.filter(v => {
            const name = lcName(v.name);

            // Match by language name (English or native)
            for (const code of Object.keys(LANGUAGE_NAME_MATCHES)) {
              for (const token of LANGUAGE_NAME_MATCHES[code]) {
                if (name.includes(token)) return true;
              }
            }

            // Match by script characters in name
            for (const entry of scriptToLang) {
              if (entry.regex.test(v.name || '')) return true;
            }

            return false;
          });

          if (availableVoices.length > 0) {
            console.info('Matched voices by name/script for local languages:', availableVoices.map(v => `${v.name} (${v.lang})`));
          }
        }

        // If still empty, retry a few times (voices may load asynchronously)
        if (availableVoices.length === 0) {
          console.warn('No local supported voices found on first pass. Retrying voice discovery...');

          // retry mechanism
          let retries = 0;
          const MAX_RETRIES = 5;
          const retryLoad = () => {
            const now = speechSynthesis.getVoices();
            const newlyMatched = now.filter(v => {
              const lang = (v.lang || '').toLowerCase();
              const primary = lang.split('-')[0];
              if (allowedPrefixes.has(primary) || allowedPrefixes.has(lang)) return true;
              const name = (v.name || '').toLowerCase();
              for (const code of Object.keys(LANGUAGE_NAME_MATCHES)) {
                for (const token of LANGUAGE_NAME_MATCHES[code]) {
                  if (name.includes(token)) return true;
                }
              }
              for (const entry of scriptToLang) {
                if (entry.regex.test(v.name || '')) return true;
              }
              return false;
            });

            if (newlyMatched.length > 0) {
              console.info('Voices discovered on retry:', newlyMatched.map(v => `${v.name} (${v.lang})`));
              availableVoices = newlyMatched;
              setVoices(availableVoices);

              const indianVoice = availableVoices.find(voice => voice.lang && voice.lang.toLowerCase().includes('en-in'));
              const englishVoice = availableVoices.find(voice => voice.lang && voice.lang.toLowerCase().startsWith('en'));
              setSelectedVoice(indianVoice || englishVoice || availableVoices[0] || now[0] || null);

              return;
            }

            retries++;
            if (retries < MAX_RETRIES) {
              setTimeout(retryLoad, 300 * retries);
            } else {
              console.warn('No local supported voices found after retries; falling back to all voices.');
              setVoices(allVoices);
              setSelectedVoice(allVoices[0] || null);
            }
          };

          retryLoad();
          return;
        }

        // At this point we have availableVoices
        const removed = allVoices.filter(v => !availableVoices.includes(v));
        if (removed.length > 0) {
          console.info('Filtered out non-local voices:', removed.map(v => `${v.name} (${v.lang})`));
        }
        setVoices(availableVoices);

        // Prefer an Indian English voice if present, otherwise prefer any local English voice
        const indianVoice = availableVoices.find(voice => voice.lang && voice.lang.toLowerCase().includes('en-in'));
        const englishVoice = availableVoices.find(voice => voice.lang && voice.lang.toLowerCase().startsWith('en'));

        setSelectedVoice(indianVoice || englishVoice || availableVoices[0] || allVoices[0] || null);
      }; 

      // Load voices immediately
      loadVoices();
      
      // Also load when voices change (some browsers load them asynchronously)
      speechSynthesis.onvoiceschanged = loadVoices;
      
      // Monitor speaking state
      const checkSpeaking = () => {
        setIsSpeaking(speechSynthesis.speaking);
      };
      
      const interval = setInterval(checkSpeaking, 100);
      
      return () => {
        clearInterval(interval);
        speechSynthesis.onvoiceschanged = null;
      };
    } else {
      setIsSupported(false);
    }
  }, []);

  // speak now returns a Promise that resolves when speech ends. Callers can await this to know when
  // it's safe to start listening again (avoids fixed timeouts and improves responsiveness).
  const speak = useCallback((text: string, options?: {
    rate?: number;
    pitch?: number;
    volume?: number;
    lang?: string;
  }): Promise<void> => {
    return new Promise((resolve) => {
      if (!isSupported || !text) {
        resolve();
        return;
      }

      // Cancel any ongoing speech
      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);

      // Choose an appropriate voice if a language is requested
      const desiredLang = options?.lang;
      let voiceToUse: SpeechSynthesisVoice | null = null;

      if (desiredLang && voices.length > 0) {
        const desiredNorm = desiredLang.toLowerCase();
        const primary = desiredNorm.split('-')[0];

        // Exact match first (e.g. 'hi-in')
        voiceToUse = voices.find(v => v.lang && v.lang.toLowerCase() === desiredNorm)
          // Prefix match (e.g. 'hi' matches 'hi-IN')
          || voices.find(v => v.lang && v.lang.toLowerCase().startsWith(primary))
          // Match by voice name containing language label (best-effort)
          || voices.find(v => v.name && v.name.toLowerCase().includes(SUPPORTED_LANGUAGES[primary]?.toLowerCase() || primary));

        if (!voiceToUse) {
          console.info(`No voice found for requested language ${desiredLang}; falling back.`);
        }
      }

      // Fallbacks
      if (!voiceToUse && selectedVoice) {
        voiceToUse = selectedVoice;
      }
      if (!voiceToUse && voices.length > 0) {
        voiceToUse = voices[0];
      }

      if (voiceToUse) {
        utterance.voice = voiceToUse;
      }

      // Set options
      utterance.rate = options?.rate || 0.9; // Slightly slower for clarity
      utterance.pitch = options?.pitch || 1;
      utterance.volume = options?.volume || 1;
      utterance.lang = options?.lang || (utterance.voice ? utterance.voice.lang : 'en-IN');

      // Event handlers
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        resolve();
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        resolve();
      };

      speechSynthesis.speak(utterance);
    });
  }, [isSupported, selectedVoice, voices]);

  const stop = useCallback(() => {
    if (isSupported) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isSupported]);

  const pause = useCallback(() => {
    if (isSupported && isSpeaking) {
      speechSynthesis.pause();
    }
  }, [isSupported, isSpeaking]);

  const resume = useCallback(() => {
    if (isSupported) {
      speechSynthesis.resume();
    }
  }, [isSupported]);

  return {
    isSupported,
    isSpeaking,
    voices,
    selectedVoice,
    speak,
    stop,
    pause,
    resume,
    setSelectedVoice,
  };
};