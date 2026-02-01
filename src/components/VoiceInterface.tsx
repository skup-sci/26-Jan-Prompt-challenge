/**
 * Modern Mandi Platform - Inspired by Professional Mandi Apps
 * 
 * Features:
 * 1. Hero section with quick commodity access
 * 2. AI Price Discovery with voice
 * 3. Trending commodities grid
 * 4. AI Negotiation Assistant
 */

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  IconButton, 
  Chip, 
  Button, 
  Grid, 
  Card, 
  CardContent,
  Container,
  Divider,
  Stack
} from '@mui/material';
import { 
  Mic, 
  Stop, 
  Psychology, 
  TrendingUp, 
  TrendingDown,
  Remove,
  Language
} from '@mui/icons-material';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { priceDiscoveryService, getAllCommodities } from '../services/PriceDiscoveryService';
import { negotiationService } from '../services/NegotiationService';
import { translationService, LanguageCode } from '../services/TranslationService';

const VoiceInterface: React.FC = () => {
  const [transcript, setTranscript] = useState('');
  const [priceResult, setPriceResult] = useState('');
  const [showNegotiation, setShowNegotiation] = useState(false);
  const [negotiationSuggestion, setNegotiationSuggestion] = useState('');
  const [currentCommodity, setCurrentCommodity] = useState('');
  const [marketPrice, setMarketPrice] = useState(0);
  const [selectedCommodityData, setSelectedCommodityData] = useState<any>(null);
  const [detectedLanguage, setDetectedLanguage] = useState<string>('en');
  const [isAiThinking, setIsAiThinking] = useState(false);
  
  const {
    isSupported: voiceSupported,
    isListening,
    startListening,
    stopListening,
    transcript: voiceTranscript,
    error: voiceError,
  } = useVoiceRecognition();

  const { speak } = useSpeechSynthesis();

  const commodities = getAllCommodities();

  // Handle voice transcript
  useEffect(() => {
    if (voiceTranscript) {
      handleQuery(voiceTranscript);
      stopListening();
    }
  }, [voiceTranscript, speak, stopListening]);

  const handleQuery = async (query: string) => {
    setTranscript(query);
    setIsAiThinking(true);

    // Detect language of the user's query to speak back in the same language
    const detection = await translationService.detectLanguage(query);
    const langCode = (detection?.language || 'en') as LanguageCode;
    setDetectedLanguage(langCode);

    const ttsLocale = (code: string) => `${code}-IN`;

    const commodity = priceDiscoveryService.parseQuery(query);
    
    // Call AI-powered price discovery
    const result = await priceDiscoveryService.getPrice(commodity, query, langCode);

    setIsAiThinking(false);

    if (result) {
      let displayText = result.conversationalResponse;

      setPriceResult(displayText);
      setSelectedCommodityData(result.commodity);
      // Speak in the detected language (fallback to en-IN)
      await speak(displayText, { lang: ttsLocale(langCode) });

      setCurrentCommodity(commodity);
      const avgPrice = (result.commodity.priceMin + result.commodity.priceMax) / 2;
      setMarketPrice(avgPrice);
      setShowNegotiation(true);
    } else {
      const notFoundEn = `${commodity} not found. Try: onion, tomato, wheat`;
      let notFound = notFoundEn;
      if (langCode !== 'en') {
        try {
          const t = await translationService.translateMessage(notFoundEn, 'en' as LanguageCode, langCode);
          notFound = t.translatedText;
        } catch (e) {
          // ignore
        }
      }
      setPriceResult(notFound);
      await speak(notFound, { lang: ttsLocale(langCode) });
      setShowNegotiation(false);
      setSelectedCommodityData(null);
    }
  }; 

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      setTranscript('');
      setPriceResult('');
      setShowNegotiation(false);
      setNegotiationSuggestion('');
      setSelectedCommodityData(null);
      startListening();
    }
  };

  const handleCommodityClick = (commodityName: string) => {
    handleQuery(commodityName);
  };

  const handleNegotiationDemo = async () => {
    setIsAiThinking(true);
    const vendorOffer = Math.round(marketPrice * 1.25);

    // Use Gemini API for negotiation advice
    try {
      const { geminiService } = await import('../services/GeminiService');
      
      if (geminiService.isConfigured()) {
        const aiAdvice = await geminiService.getNegotiationAdvice({
          commodity: currentCommodity,
          marketPrice: marketPrice,
          vendorOffer: vendorOffer,
        });

        const demoText = `🤖 AI Negotiation:\n\nVendor offers: ₹${vendorOffer}\nMarket price: ₹${Math.round(marketPrice)}\n\n${aiAdvice}`;
        
        setNegotiationSuggestion(demoText);
        await speak(`AI suggests: ${aiAdvice}`, { lang: `${detectedLanguage}-IN` });
        setIsAiThinking(false);
        return;
      }
    } catch (error) {
      console.warn('Gemini API failed, using fallback', error);
    }

    // Fallback to existing logic
    const userLang = detectedLanguage || 'en';
    const vendorLang = userLang === 'hi' ? 'hi' : 'en';

    const suggestion = await negotiationService.getNegotiationSuggestion({
      commodity: currentCommodity,
      marketPrice: marketPrice,
      currentOffer: vendorOffer,
      previousOffers: [],
      userLanguage: userLang,
      vendorLanguage: vendorLang,
    });

    const template = negotiationService.getPoliteResponseTemplate(suggestion, userLang);

    let spokenSuggestion = suggestion.message;
    let displaySuggestion = suggestion.message;

    if (userLang !== 'en') {
      try {
        const t = await translationService.translateMessage(suggestion.message, 'en' as LanguageCode, userLang as LanguageCode);
        spokenSuggestion = t.translatedText;
        const detectedTemplateLang = (await translationService.detectLanguage(template)).language;
        let finalTemplate = template;
        if (detectedTemplateLang === 'en') {
          const t2 = await translationService.translateMessage(template, 'en' as LanguageCode, userLang as LanguageCode);
          finalTemplate = t2.translatedText;
        }
        displaySuggestion = `${t.translatedText}\n\nSuggested response:\n"${finalTemplate}"`;
      } catch (e) {
        console.warn('Negotiation translation failed', e);
        displaySuggestion = `${suggestion.message}\n\nSuggested response:\n"${template}"`;
      }
    } else {
      displaySuggestion = `${suggestion.message}\n\nSuggested response:\n"${template}"`;
    }

    const demoText = `🤖 AI Negotiation:\n\nVendor offers: ₹${vendorOffer}\nMarket price: ₹${Math.round(marketPrice)}\n\n${displaySuggestion}`;

    setNegotiationSuggestion(demoText);
    await speak(`AI suggests: ${spokenSuggestion}`, { lang: `${userLang}-IN` });
    setIsAiThinking(false);
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp sx={{ color: '#4CAF50' }} />;
    if (trend === 'down') return <TrendingDown sx={{ color: '#f44336' }} />;
    return <Remove sx={{ color: '#9e9e9e' }} />;
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        pb: 4,
        background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 50%, #A5D6A7 100%)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234CAF50' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          opacity: 0.3,
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" sx={{ mb: 2 }}>
            <Chip
              icon={<Psychology />}
              label="AI-Powered"
              color="primary"
              size="small"
            />
            <Chip
              icon={<Language />}
              label="10 Languages"
              color="secondary"
              size="small"
            />
          </Stack>

          <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
            🌾 Mandi Mitra
          </Typography>
          
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            AI-Powered Price Discovery & Negotiation Assistant
          </Typography>

          {/* Voice Search */}
          <Box sx={{ mb: 4 }}>
            <IconButton
              onClick={handleMicClick}
              disabled={!voiceSupported}
              sx={{
                width: 100,
                height: 100,
                bgcolor: isListening ? '#f44336' : '#4CAF50',
                color: 'white',
                boxShadow: '0 8px 24px rgba(76, 175, 80, 0.4)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: isListening ? '#d32f2f' : '#388E3C',
                  transform: 'scale(1.05)',
                },
                '&:disabled': {
                  bgcolor: '#ccc',
                },
              }}
            >
              {isListening ? <Stop sx={{ fontSize: 50 }} /> : <Mic sx={{ fontSize: 50 }} />}
            </IconButton>
            
            <Typography variant="body1" sx={{ mt: 2, fontWeight: 500 }}>
              {isListening ? '🎤 Listening...' : isAiThinking ? '🤖 AI thinking...' : '👆 Tap to speak or select commodity below'}
            </Typography>
          </Box>
        </Box>

        {/* Trending Commodities Grid */}
        {!priceResult && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
              📊 Today's Mandi Prices
            </Typography>
            
            <Grid container spacing={2}>
              {commodities.map((commodity) => (
                <Grid item xs={6} sm={4} md={3} key={commodity.id}>
                  <Card 
                    sx={{ 
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                      },
                    }}
                    onClick={() => handleCommodityClick(commodity.name)}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="h4">{commodity.icon}</Typography>
                        {getTrendIcon(commodity.trend)}
                      </Box>
                      
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {commodity.name}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {commodity.nameHindi}
                      </Typography>
                      
                      <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                        ₹{commodity.priceMin}–{commodity.priceMax}
                      </Typography>
                      
                      <Typography variant="caption" color="text.secondary">
                        per {commodity.unit}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Voice Error */}
        {voiceError && (
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Typography color="error">
              ❌ {voiceError}
            </Typography>
          </Box>
        )}

        {/* Transcript */}
        {transcript && (
          <Card sx={{ mb: 3, bgcolor: '#f5f5f5' }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                You asked:
              </Typography>
              <Typography variant="h6" fontWeight={500}>
                "{transcript}"
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* Price Result - Detailed View */}
        {selectedCommodityData && (
          <Card sx={{ mb: 3, bgcolor: '#E8F5E9' }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h2">{selectedCommodityData.icon}</Typography>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h4" fontWeight={700} color="primary">
                    {selectedCommodityData.name}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {selectedCommodityData.nameHindi}
                  </Typography>
                </Box>
                {getTrendIcon(selectedCommodityData.trend)}
              </Stack>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Price Range
                  </Typography>
                  <Typography variant="h5" fontWeight={700} color="primary">
                    ₹{selectedCommodityData.priceMin}–{selectedCommodityData.priceMax}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    per {selectedCommodityData.unit}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Market
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {selectedCommodityData.market}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                    <Psychology color="primary" />
                    <Typography variant="body1">
                      {priceResult}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* AI Negotiation Demo Button */}
        {showNegotiation && !negotiationSuggestion && (
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<Psychology />}
              onClick={handleNegotiationDemo}
              sx={{
                py: 1.5,
                px: 4,
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: 3,
                textTransform: 'none',
                boxShadow: '0 4px 16px rgba(76, 175, 80, 0.3)',
              }}
            >
              Try AI Negotiation Assistant
            </Button>
          </Box>
        )}

        {/* AI Negotiation Result */}
        {negotiationSuggestion && (
          <Card sx={{ bgcolor: '#FFF3E0' }}>
            <CardContent>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                <Psychology color="secondary" />
                <Typography variant="h6" color="secondary" fontWeight={600}>
                  AI Negotiation Assistant
                </Typography>
              </Stack>
              <Typography 
                variant="body1" 
                sx={{ 
                  whiteSpace: 'pre-line',
                  lineHeight: 1.8,
                }}
              >
                {negotiationSuggestion}
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* Help Text */}
        {!priceResult && (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="body2" color="text.secondary">
              💡 Try saying: "Onion price", "टमाटर का भाव", "Wheat rate"
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default VoiceInterface;