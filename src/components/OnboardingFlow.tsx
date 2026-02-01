/**
 * User Onboarding Flow - Single Step with Voice Input
 * Collects: Name, Language, Location (State/District)
 */

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Person, Language, LocationOn, Mic, Stop } from '@mui/icons-material';
import { STATES } from '../data/expandedPrices';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';
import { useLanguage } from '../contexts/LanguageContext';

interface UserProfile {
  name: string;
  language: string;
  state: string;
  district: string;
}

interface OnboardingFlowProps {
  onComplete: (profile: UserProfile) => void;
}

const LANGUAGES = [
  { code: 'en', name: 'English', nameNative: 'English' },
  { code: 'hi', name: 'Hindi', nameNative: 'हिंदी' },
  { code: 'ta', name: 'Tamil', nameNative: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nameNative: 'తెలుగు' },
  { code: 'bn', name: 'Bengali', nameNative: 'বাংলা' },
  { code: 'mr', name: 'Marathi', nameNative: 'मराठी' },
  { code: 'gu', name: 'Gujarati', nameNative: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', nameNative: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nameNative: 'മലയാളം' },
  { code: 'pa', name: 'Punjabi', nameNative: 'ਪੰਜਾਬੀ' },
];

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const { setLanguage } = useLanguage();
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    language: '',
    state: '',
    district: '',
  });
  const [activeField, setActiveField] = useState<'name' | 'district' | null>(null);

  const {
    isListening,
    startListening,
    stopListening,
    transcript,
  } = useVoiceRecognition();

  // Handle voice input
  React.useEffect(() => {
    if (transcript && activeField) {
      if (activeField === 'name') {
        setProfile(prev => ({ ...prev, name: transcript }));
      } else if (activeField === 'district') {
        setProfile(prev => ({ ...prev, district: transcript }));
      }
      stopListening();
      setActiveField(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcript]);

  const handleVoiceInput = (field: 'name' | 'district') => {
    if (isListening && activeField === field) {
      stopListening();
      setActiveField(null);
    } else {
      setActiveField(field);
      startListening();
    }
  };

  const handleSubmit = () => {
    if (isFormValid()) {
      localStorage.setItem('userProfile', JSON.stringify(profile));
      // Update global language context
      setLanguage(profile.language as any);
      onComplete(profile);
    }
  };

  const isFormValid = () => {
    return (
      profile.name.trim().length > 0 &&
      profile.language.length > 0 &&
      profile.state.length > 0 &&
      profile.district.trim().length > 0
    );
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
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h2" gutterBottom sx={{ fontWeight: 700, color: 'primary.main', textShadow: '2px 2px 4px rgba(0,0,0,0.1)' }}>
            🌾 Mandi Mitra
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ fontWeight: 500 }}>
            Your AI-Powered Mandi Assistant
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Set up your profile to get started
          </Typography>
        </Box>

        <Card sx={{ mb: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}>
              Complete Your Profile
            </Typography>

            <Grid container spacing={3}>
              {/* Name Field with Voice */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Person sx={{ color: 'primary.main', mr: 1 }} />
                  <Typography variant="subtitle1" fontWeight={600}>Your Name</Typography>
                </Box>
                <TextField
                  fullWidth
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="Enter your name or use voice"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => handleVoiceInput('name')}
                          color={isListening && activeField === 'name' ? 'error' : 'primary'}
                        >
                          {isListening && activeField === 'name' ? <Stop /> : <Mic />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Language Selection */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Language sx={{ color: 'primary.main', mr: 1 }} />
                  <Typography variant="subtitle1" fontWeight={600}>Preferred Language</Typography>
                </Box>
                <Grid container spacing={1}>
                  {LANGUAGES.map((lang) => (
                    <Grid item xs={6} sm={4} md={3} key={lang.code}>
                      <Chip
                        label={lang.nameNative}
                        onClick={() => setProfile({ ...profile, language: lang.code })}
                        color={profile.language === lang.code ? 'primary' : 'default'}
                        sx={{
                          width: '100%',
                          height: 48,
                          fontSize: '1rem',
                          fontWeight: profile.language === lang.code ? 600 : 400,
                          cursor: 'pointer',
                          '&:hover': {
                            transform: 'scale(1.05)',
                          },
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Grid>

              {/* State Selection */}
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocationOn sx={{ color: 'primary.main', mr: 1 }} />
                  <Typography variant="subtitle1" fontWeight={600}>State</Typography>
                </Box>
                <TextField
                  fullWidth
                  select
                  value={profile.state}
                  onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                  placeholder="Select state"
                >
                  {STATES.map((state) => (
                    <MenuItem key={state} value={state}>
                      {state}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* District Field with Voice */}
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocationOn sx={{ color: 'primary.main', mr: 1 }} />
                  <Typography variant="subtitle1" fontWeight={600}>District</Typography>
                </Box>
                <TextField
                  fullWidth
                  value={profile.district}
                  onChange={(e) => setProfile({ ...profile, district: e.target.value })}
                  placeholder="Enter district or use voice"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => handleVoiceInput('district')}
                          color={isListening && activeField === 'district' ? 'error' : 'primary'}
                        >
                          {isListening && activeField === 'district' ? <Stop /> : <Mic />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            {/* Submit Button */}
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleSubmit}
              disabled={!isFormValid()}
              sx={{
                mt: 4,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 600,
                boxShadow: '0 4px 16px rgba(76, 175, 80, 0.3)',
              }}
            >
              Get Started 🚀
            </Button>
          </CardContent>
        </Card>

        <Box sx={{ textAlign: 'center' }}>
          <Chip
            icon={<Language />}
            label="10 Languages"
            color="primary"
            sx={{ mr: 1, mb: 1 }}
          />
          <Chip
            icon={<Mic />}
            label="Voice Input"
            color="secondary"
            sx={{ mr: 1, mb: 1 }}
          />
          <Chip
            label="AI-Powered"
            variant="outlined"
            sx={{ mb: 1 }}
          />
        </Box>
      </Container>
    </Box>
  );
};
