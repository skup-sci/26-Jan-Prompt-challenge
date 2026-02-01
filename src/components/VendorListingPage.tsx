/**
 * Vendor Listing Page - Farmers/Vendors can list their items
 * Voice or manual input supported
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
  MenuItem,
  IconButton,
  InputAdornment,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  Add,
  Mic,
  Stop,
  Delete,
  RecordVoiceOver,
} from '@mui/icons-material';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';
import { ALL_PRICES } from '../data/expandedPrices';
import { geminiService } from '../services/GeminiService';

interface VendorListing {
  id: string;
  vendorName: string;
  commodity: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  location: string;
  contact: string;
  timestamp: Date;
}

export const VendorListingPage: React.FC = () => {
  const [listings, setListings] = useState<VendorListing[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [isSmartVoiceActive, setIsSmartVoiceActive] = useState(false);
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [aiMessage, setAiMessage] = useState('');
  const [formData, setFormData] = useState({
    commodity: '',
    quantity: '',
    unit: 'kg',
    pricePerUnit: '',
    location: '',
    contact: '',
  });

  const {
    isListening,
    startListening,
    stopListening,
    transcript,
  } = useVoiceRecognition();

  // Load listings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('vendorListings');
    if (saved) {
      const parsed = JSON.parse(saved);
      setListings(parsed.map((l: any) => ({ ...l, timestamp: new Date(l.timestamp) })));
    }
  }, []);

  // Handle voice input for individual fields
  useEffect(() => {
    if (transcript && activeField && !isSmartVoiceActive) {
      setFormData({ ...formData, [activeField]: transcript });
      stopListening();
      setActiveField(null);
    }
  }, [transcript, activeField, isSmartVoiceActive]);

  // Handle smart voice listing
  useEffect(() => {
    const processSmartVoice = async () => {
      if (transcript && isSmartVoiceActive && !isProcessingAI) {
        setIsProcessingAI(true);
        setAiMessage('🤖 AI is parsing your command...');
        stopListening();

        console.log('🎤 Voice transcript:', transcript);

        try {
          const parsed = await geminiService.parseListingCommand(transcript);
          
          console.log('📊 Parsed result:', parsed);
          
          if (parsed && parsed.confidence > 0.2) { // Very lenient threshold
            // Auto-fill form with parsed data
            setFormData({
              commodity: parsed.commodity,
              quantity: parsed.quantity.toString(),
              unit: parsed.unit,
              pricePerUnit: parsed.pricePerUnit.toString(),
              location: formData.location, // Keep existing location
              contact: formData.contact, // Keep existing contact
            });
            setAiMessage(`✅ Parsed: ${parsed.commodity}, ${parsed.quantity} ${parsed.unit} @ ₹${parsed.pricePerUnit}/${parsed.unit}`);
            setShowForm(true);
          } else {
            console.warn('⚠️ Low confidence or invalid parse:', parsed);
            setAiMessage(`❌ Could not understand "${transcript}". Try: "6 kg aloo 30 rupaye" or "10 kg pyaaz 25 rupaye kilo"`);
          }
        } catch (error) {
          console.error('❌ Smart voice error:', error);
          setAiMessage('❌ AI parsing failed. Please try again or use manual form.');
        } finally {
          setIsProcessingAI(false);
          setIsSmartVoiceActive(false);
        }
      }
    };

    processSmartVoice();
  }, [transcript, isSmartVoiceActive, isProcessingAI]);

  const handleVoiceInput = (field: string) => {
    if (isListening && activeField === field) {
      stopListening();
      setActiveField(null);
    } else {
      setActiveField(field);
      setIsSmartVoiceActive(false);
      startListening();
    }
  };

  const handleSmartVoiceListing = () => {
    if (isSmartVoiceActive) {
      // Stop smart voice
      stopListening();
      setIsSmartVoiceActive(false);
      setAiMessage('');
    } else {
      // Start smart voice
      setIsSmartVoiceActive(true);
      setActiveField(null);
      setAiMessage('🎤 Listening... Say everything in one go (e.g., "26 kg aloo bechna hai 30 rupaye kilo")');
      startListening();
    }
  };

  const handleSubmit = () => {
    if (!formData.commodity || !formData.quantity || !formData.pricePerUnit) {
      return;
    }

    const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    
    const newListing: VendorListing = {
      id: Date.now().toString(),
      vendorName: userProfile.name || 'Anonymous',
      commodity: formData.commodity,
      quantity: parseFloat(formData.quantity),
      unit: formData.unit,
      pricePerUnit: parseFloat(formData.pricePerUnit),
      location: formData.location || userProfile.state || 'Unknown',
      contact: formData.contact || 'Not provided',
      timestamp: new Date(),
    };

    const updatedListings = [...listings, newListing];
    setListings(updatedListings);
    localStorage.setItem('vendorListings', JSON.stringify(updatedListings));

    // Reset form
    setFormData({
      commodity: '',
      quantity: '',
      unit: 'kg',
      pricePerUnit: '',
      location: '',
      contact: '',
    });
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    const updatedListings = listings.filter(l => l.id !== id);
    setListings(updatedListings);
    localStorage.setItem('vendorListings', JSON.stringify(updatedListings));
  };

  const commodityNames = [...new Set(ALL_PRICES.map(p => p.name))].sort();

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
            📝 List Your Products
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setShowForm(!showForm)}
            size="large"
          >
            {showForm ? 'Cancel' : 'Add Listing'}
          </Button>
        </Box>

        {/* Smart Voice Listing Button */}
        <Card sx={{ mb: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.1)', background: 'linear-gradient(135deg, #FFA726 0%, #FF9800 100%)' }}>
          <CardContent sx={{ textAlign: 'center', py: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'white', mb: 2 }}>
              🤖 Smart Voice Listing (AI-Powered)
            </Typography>
            <Typography variant="body1" sx={{ color: 'white', mb: 3, opacity: 0.95 }}>
              Say everything in one go! Example: "26 kg aloo bechna hai 30 rupaye kilo"
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={isSmartVoiceActive ? <Stop /> : <RecordVoiceOver />}
              onClick={handleSmartVoiceListing}
              disabled={isProcessingAI}
              sx={{
                minHeight: 80,
                minWidth: 250,
                fontSize: '1.2rem',
                fontWeight: 700,
                background: isSmartVoiceActive ? '#EF5350' : 'white',
                color: isSmartVoiceActive ? 'white' : '#FF9800',
                '&:hover': {
                  background: isSmartVoiceActive ? '#E53935' : '#f5f5f5',
                },
                animation: isSmartVoiceActive ? 'pulse 1.5s ease-in-out infinite' : 'none',
                '@keyframes pulse': {
                  '0%, 100%': { transform: 'scale(1)' },
                  '50%': { transform: 'scale(1.05)' },
                },
              }}
            >
              {isProcessingAI ? (
                <>
                  <CircularProgress size={24} sx={{ mr: 1, color: 'white' }} />
                  Processing...
                </>
              ) : isSmartVoiceActive ? (
                'Stop Recording'
              ) : (
                'Start Smart Voice'
              )}
            </Button>
            {aiMessage && (
              <Alert 
                severity={aiMessage.includes('✅') ? 'success' : aiMessage.includes('❌') ? 'error' : 'info'} 
                sx={{ mt: 2, fontSize: '1rem' }}
              >
                {aiMessage}
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Add Listing Form */}
        {showForm && (
          <Card sx={{ mb: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Create New Listing
              </Typography>
              <Alert severity="info" sx={{ mb: 3 }}>
                Use voice input (🎤) or type manually to add your product details
              </Alert>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Commodity"
                    value={formData.commodity}
                    onChange={(e) => setFormData({ ...formData, commodity: e.target.value })}
                  >
                    {commodityNames.map((name) => (
                      <MenuItem key={name} value={name}>
                        {name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => handleVoiceInput('quantity')}
                            color={isListening && activeField === 'quantity' ? 'error' : 'primary'}
                          >
                            {isListening && activeField === 'quantity' ? <Stop /> : <Mic />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    select
                    label="Unit"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  >
                    <MenuItem value="kg">Kilogram (kg)</MenuItem>
                    <MenuItem value="quintal">Quintal</MenuItem>
                    <MenuItem value="ton">Ton</MenuItem>
                    <MenuItem value="piece">Piece</MenuItem>
                    <MenuItem value="dozen">Dozen</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Price per Unit (₹)"
                    type="number"
                    value={formData.pricePerUnit}
                    onChange={(e) => setFormData({ ...formData, pricePerUnit: e.target.value })}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => handleVoiceInput('pricePerUnit')}
                            color={isListening && activeField === 'pricePerUnit' ? 'error' : 'primary'}
                          >
                            {isListening && activeField === 'pricePerUnit' ? <Stop /> : <Mic />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="City/District"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => handleVoiceInput('location')}
                            color={isListening && activeField === 'location' ? 'error' : 'primary'}
                          >
                            {isListening && activeField === 'location' ? <Stop /> : <Mic />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Contact (Phone/WhatsApp)"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    placeholder="Optional"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => handleVoiceInput('contact')}
                            color={isListening && activeField === 'contact' ? 'error' : 'primary'}
                          >
                            {isListening && activeField === 'contact' ? <Stop /> : <Mic />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>

              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleSubmit}
                disabled={!formData.commodity || !formData.quantity || !formData.pricePerUnit}
                sx={{ mt: 3 }}
              >
                Submit Listing
              </Button>
            </CardContent>
          </Card>
        )}

        {/* My Listings */}
        <Card sx={{ boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              My Listings ({listings.length})
            </Typography>

            {listings.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  No listings yet. Click "Add Listing" to create your first listing.
                </Typography>
              </Box>
            ) : (
              <List>
                {listings.map((listing, index) => (
                  <React.Fragment key={listing.id}>
                    {index > 0 && <Divider />}
                    <ListItem>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="h6" fontWeight={600}>
                              {listing.commodity}
                            </Typography>
                            <Chip label={`₹${listing.pricePerUnit}/${listing.unit}`} color="primary" size="small" />
                          </Box>
                        }
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="body2">
                              Quantity: {listing.quantity} {listing.unit}
                            </Typography>
                            <Typography variant="body2">
                              Location: {listing.location}
                            </Typography>
                            <Typography variant="body2">
                              Contact: {listing.contact}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Listed: {listing.timestamp.toLocaleString()}
                            </Typography>
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" onClick={() => handleDelete(listing.id)} color="error">
                          <Delete />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};
