/**
 * Vendor Chat Page - Complete AI-assisted negotiation with deal closure
 * Features: Smart vendor responses, deal acceptance/rejection, history
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Paper,
  Chip,
  Avatar,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  Send,
  Psychology,
  Translate,
  Person,
  Store,
  CheckCircle,
  Cancel,
  Handshake,
} from '@mui/icons-material';
import { negotiationService } from '../services/NegotiationService';

interface Message {
  id: string;
  from: 'buyer' | 'vendor';
  text: string;
  translatedText?: string;
  timestamp: Date;
  isOffer?: boolean;
  offerPrice?: number;
}

interface Deal {
  id: string;
  commodity: string;
  quantity: number;
  unit: string;
  agreedPrice: number;
  vendor: string;
  buyer: string;
  timestamp: Date;
}

export const VendorChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [aiSuggestionBubbles, setAiSuggestionBubbles] = useState<string[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentOffer, setCurrentOffer] = useState<number | null>(null);
  const [vendorOffer, setVendorOffer] = useState<number | null>(null);
  const [marketPrice, setMarketPrice] = useState(25);
  const [commodity, setCommodity] = useState('Onion');
  const [quantity, setQuantity] = useState(100);
  const [unit, setUnit] = useState('kg');
  const [negotiationRound, setNegotiationRound] = useState(0);
  const [dealClosed, setDealClosed] = useState(false);
  const [showDealDialog, setShowDealDialog] = useState(false);
  const [finalDeal, setFinalDeal] = useState<Deal | null>(null);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState('');

  const buyerLang = 'en';
  const vendorLang = 'hi';

  // Load selected listing from marketplace
  useEffect(() => {
    const selectedListing = localStorage.getItem('selectedVendorListing');
    if (selectedListing) {
      const listing = JSON.parse(selectedListing);
      setCommodity(listing.commodity);
      setQuantity(listing.quantity);
      setUnit(listing.unit);
      setMarketPrice(listing.pricePerUnit);
      setVendorOffer(listing.pricePerUnit);
      
      // Add initial vendor message
      const initialMessage: Message = {
        id: '1',
        from: 'vendor',
        text: `नमस्ते! ${listing.commodity} ₹${listing.pricePerUnit} प्रति ${listing.unit} है। ${listing.quantity} ${listing.unit} उपलब्ध है।`,
        translatedText: `Hello! ${listing.commodity} is ₹${listing.pricePerUnit} per ${listing.unit}. ${listing.quantity} ${listing.unit} available.`,
        timestamp: new Date(),
        isOffer: true,
        offerPrice: listing.pricePerUnit,
      };
      setMessages([initialMessage]);
    }
  }, []);

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputText;
    if (!textToSend.trim() || dealClosed) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      from: 'buyer',
      text: textToSend,
      translatedText: `[Hindi] ${textToSend}`,
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInputText('');

    // Extract price if mentioned
    const priceMatch = textToSend.match(/₹?(\d+)/);
    if (priceMatch) {
      const offer = parseInt(priceMatch[1]);
      setCurrentOffer(offer);
      newMessage.isOffer = true;
      newMessage.offerPrice = offer;
      
      // Get AI suggestion
      const suggestion = await negotiationService.getNegotiationSuggestion({
        commodity: commodity,
        marketPrice: marketPrice,
        currentOffer: offer,
        previousOffers: [],
        userLanguage: buyerLang,
        vendorLanguage: vendorLang,
      });

      const template = negotiationService.getPoliteResponseTemplate(suggestion, buyerLang);
      setAiSuggestion(`${suggestion.message}\n\nSuggested response: "${template}"`);
      
      // Generate clickable suggestion bubbles
      const bubbles = [];
      if (offer < marketPrice) {
        bubbles.push(`Can you do ₹${Math.round(marketPrice * 0.95)}?`);
        bubbles.push(`₹${Math.round((offer + marketPrice) / 2)} is my best offer`);
        bubbles.push(`Market price is ₹${marketPrice}, let's meet halfway`);
      } else {
        bubbles.push(`₹${offer} is fair, please accept`);
        bubbles.push(`This is my final offer`);
        bubbles.push(`Can we close the deal?`);
      }
      setAiSuggestionBubbles(bubbles);

      // Simulate vendor response
      setTimeout(() => {
        simulateVendorResponse(offer);
      }, 2000);
    }
  };

  const simulateVendorResponse = async (buyerOffer: number) => {
    setNegotiationRound(prev => prev + 1);
    
    let vendorResponse = '';
    let vendorTranslation = '';
    let newVendorOffer = vendorOffer || marketPrice;

    // Smart vendor logic based on buyer offer
    const difference = ((buyerOffer - marketPrice) / marketPrice) * 100;

    if (difference >= -5 && difference <= 5) {
      // Offer is close to market price - accept
      vendorResponse = `बहुत अच्छा! मैं ₹${buyerOffer} में सहमत हूं। डील पक्की?`;
      vendorTranslation = `Very good! I agree to ₹${buyerOffer}. Deal confirmed?`;
      newVendorOffer = buyerOffer;
      setVendorOffer(buyerOffer);
    } else if (difference < -5 && difference >= -15) {
      // Offer is low but negotiable - counter offer
      newVendorOffer = Math.round((buyerOffer + marketPrice) / 2);
      vendorResponse = `यह बहुत कम है। मैं ₹${newVendorOffer} में दे सकता हूं।`;
      vendorTranslation = `This is too low. I can give at ₹${newVendorOffer}.`;
      setVendorOffer(newVendorOffer);
    } else if (difference < -15) {
      // Offer is too low - reject
      vendorResponse = `माफ़ करें, यह बहुत कम है। मेरी अंतिम कीमत ₹${Math.round(marketPrice * 0.95)} है।`;
      vendorTranslation = `Sorry, this is too low. My final price is ₹${Math.round(marketPrice * 0.95)}.`;
      newVendorOffer = Math.round(marketPrice * 0.95);
      setVendorOffer(newVendorOffer);
    } else {
      // Offer is above market - accept immediately
      vendorResponse = `बिल्कुल! ₹${buyerOffer} में डील पक्की। धन्यवाद!`;
      vendorTranslation = `Absolutely! Deal confirmed at ₹${buyerOffer}. Thank you!`;
      newVendorOffer = buyerOffer;
      setVendorOffer(buyerOffer);
    }

    const vendorMessage: Message = {
      id: Date.now().toString(),
      from: 'vendor',
      text: vendorResponse,
      translatedText: vendorTranslation,
      timestamp: new Date(),
      isOffer: true,
      offerPrice: newVendorOffer,
    };

    setMessages(prev => [...prev, vendorMessage]);

    // Get AI recommendation using Gemini
    setIsAiThinking(true);
    try {
      const { geminiService } = await import('../services/GeminiService');
      
      if (geminiService.isConfigured()) {
        const aiAdvice = await geminiService.getNegotiationAdvice({
          commodity: commodity,
          marketPrice: marketPrice,
          vendorOffer: newVendorOffer,
          buyerBudget: buyerOffer,
        });
        setAiRecommendation(aiAdvice);
      }
    } catch (error) {
      console.warn('Gemini API failed for recommendation', error);
    }
    setIsAiThinking(false);

    // Check if deal should be auto-accepted
    if (Math.abs(buyerOffer - newVendorOffer) <= 2) {
      setTimeout(() => {
        setVendorOffer(buyerOffer);
      }, 1000);
    }
  };

  const handleAcceptDeal = () => {
    if (!vendorOffer) return;

    const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    
    const deal: Deal = {
      id: Date.now().toString(),
      commodity: commodity,
      quantity: quantity,
      unit: unit,
      agreedPrice: vendorOffer,
      vendor: 'Ram Singh',
      buyer: userProfile.name || 'Buyer',
      timestamp: new Date(),
    };

    // Save deal to localStorage
    const deals = JSON.parse(localStorage.getItem('completedDeals') || '[]');
    deals.push(deal);
    localStorage.setItem('completedDeals', JSON.stringify(deals));

    setFinalDeal(deal);
    setDealClosed(true);
    setShowDealDialog(true);

    // Add final message
    const finalMessage: Message = {
      id: Date.now().toString(),
      from: 'buyer',
      text: `Deal accepted at ₹${vendorOffer}!`,
      translatedText: `[Hindi] ₹${vendorOffer} पर डील स्वीकार की!`,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, finalMessage]);
  };

  const handleRejectDeal = () => {
    const rejectMessage: Message = {
      id: Date.now().toString(),
      from: 'buyer',
      text: 'Sorry, I cannot accept this price.',
      translatedText: '[Hindi] माफ़ करें, मैं यह कीमत स्वीकार नहीं कर सकता।',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, rejectMessage]);

    setTimeout(() => {
      const vendorMessage: Message = {
        id: Date.now().toString(),
        from: 'vendor',
        text: 'कोई बात नहीं। फिर मिलेंगे!',
        translatedText: 'No problem. See you again!',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, vendorMessage]);
      setDealClosed(true);
    }, 1500);
  };

  const handleStartNewNegotiation = () => {
    setMessages([]);
    setCurrentOffer(null);
    setVendorOffer(null);
    setNegotiationRound(0);
    setDealClosed(false);
    setShowDealDialog(false);
    setFinalDeal(null);
    setAiSuggestion('');
    localStorage.removeItem('selectedVendorListing');
  };

  const handleDemoNegotiation = () => {
    const demoMessages: Message[] = [
      {
        id: '1',
        from: 'vendor',
        text: 'नमस्ते! प्याज ₹32 प्रति किलो है',
        translatedText: 'Hello! Onion is ₹32 per kg',
        timestamp: new Date(),
        isOffer: true,
        offerPrice: 32,
      },
    ];

    setMessages(demoMessages);
    setCommodity('Onion');
    setMarketPrice(25);
    setVendorOffer(32);
    setQuantity(100);
    setUnit('kg');
    setDealClosed(false);
    
    // Set initial AI suggestion bubbles
    setAiSuggestionBubbles([
      'Can you do ₹28?',
      'Market price is ₹25, can we meet at ₹26?',
      'I can offer ₹27 per kg',
    ]);
    setAiSuggestion('Vendor is asking ₹32/kg, which is 28% above market price (₹25). Try negotiating down to ₹26-28.');
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        py: 4,
        background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 50%, #A5D6A7 100%)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234CAF50' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          opacity: 0.4,
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            💬 Vendor Chat - AI Negotiation
          </Typography>
          {dealClosed && (
            <Button
              variant="contained"
              onClick={handleStartNewNegotiation}
              startIcon={<Handshake />}
            >
              New Negotiation
            </Button>
          )}
        </Box>

        <Grid container spacing={3}>
          {/* Chat Area */}
          <Grid item xs={12} md={8}>
            <Card sx={{ height: '70vh', display: 'flex', flexDirection: 'column', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
              {/* Chat Header */}
              <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: 'white', color: 'primary.main', mr: 2 }}>
                      <Store />
                    </Avatar>
                    <Box>
                      <Typography variant="h6">Vendor - Ram Singh</Typography>
                      <Typography variant="caption">Azadpur Mandi, Delhi</Typography>
                    </Box>
                  </Box>
                  <Box>
                    <Chip icon={<Translate />} label="Auto-Translate: ON" size="small" sx={{ bgcolor: 'white' }} />
                  </Box>
                </Box>
              </Box>

              {/* Messages */}
              <Box sx={{ flex: 1, overflow: 'auto', p: 2, bgcolor: '#f5f5f5' }}>
                {messages.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="body1" color="text.secondary" gutterBottom>
                      No messages yet
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={handleDemoNegotiation}
                      startIcon={<Psychology />}
                      size="large"
                    >
                      Start Demo Negotiation
                    </Button>
                  </Box>
                ) : (
                  <>
                    {messages.map((msg) => (
                      <Box
                        key={msg.id}
                        sx={{
                          display: 'flex',
                          justifyContent: msg.from === 'buyer' ? 'flex-end' : 'flex-start',
                          mb: 2,
                        }}
                      >
                        <Paper
                          sx={{
                            p: 2,
                            maxWidth: '70%',
                            bgcolor: msg.from === 'buyer' ? 'primary.main' : 'white',
                            color: msg.from === 'buyer' ? 'white' : 'text.primary',
                            boxShadow: 2,
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Avatar sx={{ width: 24, height: 24, mr: 1 }}>
                              {msg.from === 'buyer' ? <Person /> : <Store />}
                            </Avatar>
                            <Typography variant="caption" fontWeight={600}>
                              {msg.from === 'buyer' ? 'You' : 'Vendor'}
                            </Typography>
                            {msg.isOffer && (
                              <Chip label={`₹${msg.offerPrice}`} size="small" color="secondary" sx={{ ml: 1 }} />
                            )}
                          </Box>
                          <Typography variant="body1">{msg.text}</Typography>
                          {msg.translatedText && (
                            <Box sx={{ mt: 1, pt: 1, borderTop: 1, borderColor: 'divider' }}>
                              <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', opacity: 0.8 }}>
                                <Translate sx={{ fontSize: 14, mr: 0.5 }} />
                                {msg.translatedText}
                              </Typography>
                            </Box>
                          )}
                          <Typography variant="caption" sx={{ display: 'block', mt: 1, opacity: 0.7 }}>
                            {msg.timestamp.toLocaleTimeString()}
                          </Typography>
                        </Paper>
                      </Box>
                    ))}

                    {/* AI Recommendation Before Decision */}
                    {vendorOffer && !dealClosed && messages.length > 0 && (
                      <>
                        <Alert severity="info" icon={<Psychology />} sx={{ mt: 3 }}>
                          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                            🤖 AI Recommendation {isAiThinking && '(thinking...)'}
                          </Typography>
                          <Typography variant="body2">
                            {aiRecommendation || (() => {
                              const diff = ((vendorOffer - marketPrice) / marketPrice) * 100;
                              if (diff <= 0) {
                                return `✅ ACCEPT - Vendor's offer (₹${vendorOffer}) is ${Math.abs(diff).toFixed(0)}% below market price (₹${marketPrice}). This is an excellent deal!`;
                              } else if (diff <= 5) {
                                return `✅ ACCEPT - Vendor's offer (₹${vendorOffer}) is only ${diff.toFixed(0)}% above market price. This is fair and reasonable.`;
                              } else if (diff <= 10) {
                                return `⚠️ COUNTER - Vendor's offer (₹${vendorOffer}) is ${diff.toFixed(0)}% above market. Try offering ₹${Math.round(marketPrice * 1.03)} (3% above market).`;
                              } else if (diff <= 20) {
                                return `⏳ WAIT - Vendor's offer (₹${vendorOffer}) is ${diff.toFixed(0)}% above market. Counter with ₹${Math.round(marketPrice * 1.05)} or wait for a better offer.`;
                              } else {
                                return `❌ REJECT - Vendor's offer (₹${vendorOffer}) is ${diff.toFixed(0)}% above market price. This is too high. Consider rejecting or making a much lower counter-offer.`;
                              }
                            })()}
                          </Typography>
                        </Alert>

                        {/* Deal Action Buttons */}
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 2 }}>
                          <Button
                            variant="contained"
                            color="success"
                            size="large"
                            startIcon={<CheckCircle />}
                            onClick={handleAcceptDeal}
                            sx={{ minWidth: 150 }}
                          >
                            Accept ₹{vendorOffer}
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            size="large"
                            startIcon={<Cancel />}
                            onClick={handleRejectDeal}
                            sx={{ minWidth: 150 }}
                          >
                            Reject
                          </Button>
                        </Box>
                      </>
                    )}

                    {dealClosed && (
                      <Alert severity="success" sx={{ mt: 2 }}>
                        <Typography variant="h6">
                          {finalDeal ? '🎉 Deal Completed!' : 'Negotiation Ended'}
                        </Typography>
                      </Alert>
                    )}
                  </>
                )}
              </Box>

              {/* Input Area */}
              {!dealClosed && (
                <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      fullWidth
                      placeholder="Type your message... (e.g., Can you do ₹26?)"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button
                      variant="contained"
                      onClick={() => handleSendMessage()}
                      endIcon={<Send />}
                      disabled={!inputText.trim()}
                    >
                      Send
                    </Button>
                  </Box>
                </Box>
              )}
            </Card>
          </Grid>

          {/* AI Assistant Panel */}
          <Grid item xs={12} md={4}>
            <Card sx={{ mb: 2, boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Psychology color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Market Info</Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Commodity
                    </Typography>
                    <Typography variant="h6">{commodity}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Quantity: {quantity} {unit}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Market Price
                    </Typography>
                    <Typography variant="h5" color="primary" fontWeight={700}>
                      ₹{marketPrice}/{unit}
                    </Typography>
                  </Grid>
                  {vendorOffer && (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        Vendor's Offer
                      </Typography>
                      <Typography variant="h5" fontWeight={700}>
                        ₹{vendorOffer}/{unit}
                      </Typography>
                      <Chip
                        label={
                          vendorOffer < marketPrice
                            ? `${((1 - vendorOffer / marketPrice) * 100).toFixed(0)}% below market`
                            : vendorOffer > marketPrice
                            ? `${((vendorOffer / marketPrice - 1) * 100).toFixed(0)}% above market`
                            : 'At market price'
                        }
                        size="small"
                        color={vendorOffer <= marketPrice ? 'success' : 'warning'}
                        sx={{ mt: 1 }}
                      />
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Negotiation Round
                    </Typography>
                    <Typography variant="h6">{negotiationRound}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {(aiSuggestion || aiSuggestionBubbles.length > 0) && !dealClosed && (
              <Card sx={{ bgcolor: '#FFF3E0', mb: 2, boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Psychology color="secondary" sx={{ mr: 1 }} />
                    <Typography variant="h6" color="secondary">
                      AI Suggestions
                    </Typography>
                  </Box>
                  
                  {aiSuggestion && (
                    <Alert severity="info" sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                        {aiSuggestion}
                      </Typography>
                    </Alert>
                  )}
                  
                  {/* Clickable Suggestion Bubbles */}
                  {aiSuggestionBubbles.length > 0 && (
                    <>
                      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                        Quick Responses (Click to send):
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {aiSuggestionBubbles.map((bubble, index) => (
                          <Button
                            key={index}
                            variant="outlined"
                            size="small"
                            onClick={() => {
                              handleSendMessage(bubble);
                            }}
                            sx={{
                              justifyContent: 'flex-start',
                              textAlign: 'left',
                              textTransform: 'none',
                              '&:hover': {
                                bgcolor: 'primary.light',
                                color: 'white',
                              },
                            }}
                          >
                            💬 {bubble}
                          </Button>
                        ))}
                      </Box>
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            <Card sx={{ boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Features
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Chip icon={<Translate />} label="Auto-Translation" color="primary" />
                  <Chip icon={<Psychology />} label="AI Price Suggestions" color="secondary" />
                  <Chip icon={<Handshake />} label="Deal Closure" color="success" />
                  <Chip label="Smart Vendor Responses" variant="outlined" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Deal Summary Dialog */}
        <Dialog open={showDealDialog} onClose={() => setShowDealDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ bgcolor: 'success.main', color: 'white' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CheckCircle sx={{ mr: 1 }} />
              Deal Completed Successfully!
            </Box>
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            {finalDeal && (
              <List>
                <ListItem>
                  <ListItemText primary="Commodity" secondary={finalDeal.commodity} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Quantity" secondary={`${finalDeal.quantity} ${finalDeal.unit}`} />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Agreed Price" 
                    secondary={
                      <Typography variant="h5" color="primary" fontWeight={700}>
                        ₹{finalDeal.agreedPrice}/{finalDeal.unit}
                      </Typography>
                    } 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Total Amount" 
                    secondary={
                      <Typography variant="h4" color="success.main" fontWeight={700}>
                        ₹{(finalDeal.agreedPrice * finalDeal.quantity).toFixed(2)}
                      </Typography>
                    } 
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText primary="Vendor" secondary={finalDeal.vendor} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Buyer" secondary={finalDeal.buyer} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Date & Time" secondary={finalDeal.timestamp.toLocaleString()} />
                </ListItem>
              </List>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowDealDialog(false)} variant="outlined">
              Close
            </Button>
            <Button onClick={handleStartNewNegotiation} variant="contained" color="primary">
              Start New Negotiation
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};
