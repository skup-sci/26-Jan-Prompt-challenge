/**
 * Multilingual Mandi Platform - Complete App
 * 
 * Features:
 * 1. User Onboarding (Name, Language, Location)
 * 2. Home - Voice Price Discovery
 * 3. Live Rates - All India prices
 * 4. Vendor Chat - AI-assisted negotiation with translation
 * 5. Running price ticker in header
 */

import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home,
  ShowChart,
  Chat,
  Person,
  Language as LanguageIcon,
} from '@mui/icons-material';
import { hariyaliTheme } from './theme/hariyaliTheme';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { OnboardingFlow } from './components/OnboardingFlow';
import { PriceTicker } from './components/PriceTicker';
import { Footer } from './components/Footer';
import VoiceInterface from './components/VoiceInterface';
import { LiveRatesPage } from './components/LiveRatesPage';
import { VendorChatPage } from './components/VendorChatPage';
import { VendorListingPage } from './components/VendorListingPage';
import { MarketplacePage } from './components/MarketplacePage';

type ViewType = 'home' | 'rates' | 'chat' | 'marketplace' | 'list';

interface UserProfile {
  name: string;
  language: string;
  state: string;
  district: string;
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

function AppContent() {
  const isMobile = useMediaQuery(hariyaliTheme.breakpoints.down('sm'));
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const { currentLanguage, setLanguage } = useLanguage();
  const [languageMenuAnchor, setLanguageMenuAnchor] = useState<null | HTMLElement>(null);

  useEffect(() => {
    // Check if user has completed onboarding
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
      setShowOnboarding(false);
    }
  }, []);

  // Listen for navigation events from other components
  useEffect(() => {
    const handleNavigate = (event: any) => {
      setCurrentView(event.detail as ViewType);
    };
    window.addEventListener('navigate', handleNavigate);
    return () => window.removeEventListener('navigate', handleNavigate);
  }, []);

  const handleOnboardingComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    setShowOnboarding(false);
  };

  const menuItems = [
    { id: 'home', label: 'Home', icon: <Home /> },
    { id: 'rates', label: 'Live Rates', icon: <ShowChart /> },
    { id: 'marketplace', label: 'Marketplace', icon: <Chat /> },
    { id: 'list', label: 'List Item', icon: <Person /> },
    { id: 'chat', label: 'Chat', icon: <Chat /> },
  ];

  const handleLanguageMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setLanguageMenuAnchor(event.currentTarget);
  };

  const handleLanguageMenuClose = () => {
    setLanguageMenuAnchor(null);
  };

  const handleLanguageChange = (langCode: string) => {
    setLanguage(langCode as any);
    handleLanguageMenuClose();
  };

  const getCurrentLanguageName = () => {
    const lang = LANGUAGES.find(l => l.code === currentLanguage);
    return lang ? lang.nameNative : 'English';
  };

  if (showOnboarding) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Price Ticker */}
        <PriceTicker />

        {/* App Bar */}
        <AppBar position="sticky" elevation={2}>
          <Toolbar>
            {isMobile && (
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => setDrawerOpen(true)}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                🌾
              </Typography>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                  Mandi Mitra
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    display: 'block',
                    fontSize: '0.65rem',
                    fontWeight: 500,
                    opacity: 0.9,
                    lineHeight: 1,
                  }}
                >
                  🇮🇳 एक कदम विकसित भारत की ओर
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ flexGrow: 1 }} />

            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                {menuItems.map((item) => (
                  <Button
                    key={item.id}
                    color="inherit"
                    startIcon={item.icon}
                    onClick={() => setCurrentView(item.id as ViewType)}
                    sx={{
                      bgcolor: currentView === item.id ? 'rgba(255,255,255,0.2)' : 'transparent',
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
              {/* Language Selector */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <IconButton
                  color="inherit"
                  onClick={handleLanguageMenuOpen}
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.1)',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
                  }}
                >
                  <LanguageIcon />
                </IconButton>
                {!isMobile && (
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    {getCurrentLanguageName()}
                  </Typography>
                )}
              </Box>
              <Menu
                anchorEl={languageMenuAnchor}
                open={Boolean(languageMenuAnchor)}
                onClose={handleLanguageMenuClose}
              >
                {LANGUAGES.map((lang) => (
                  <MenuItem
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    selected={currentLanguage === lang.code}
                  >
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="body2">{lang.nameNative}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {lang.name}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Menu>

              {/* User Profile */}
              <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>
                <Person />
              </Avatar>
              {!isMobile && userProfile && (
                <Typography variant="body2" sx={{ ml: 1 }}>
                  {userProfile.name}
                </Typography>
              )}
            </Box>
          </Toolbar>
        </AppBar>

        {/* Mobile Drawer */}
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          <Box sx={{ width: 250, pt: 2 }}>
            <Box sx={{ px: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="h6" fontWeight={700}>
                  🌾 Mandi Mitra
                </Typography>
              </Box>
              <Typography 
                variant="caption" 
                sx={{ 
                  display: 'block',
                  fontSize: '0.65rem',
                  fontWeight: 500,
                  color: 'text.secondary',
                  mb: 1,
                }}
              >
                🇮🇳 एक कदम विकसित भारत की ओर
              </Typography>
              {userProfile && (
                <Typography variant="body2" color="text.secondary">
                  {userProfile.name} • {userProfile.state}
                </Typography>
              )}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <LanguageIcon fontSize="small" color="primary" />
                <Typography variant="caption" color="text.secondary">
                  {getCurrentLanguageName()}
                </Typography>
              </Box>
            </Box>
            <List>
              {menuItems.map((item) => (
                <ListItem
                  button
                  key={item.id}
                  selected={currentView === item.id}
                  onClick={() => {
                    setCurrentView(item.id as ViewType);
                    setDrawerOpen(false);
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>

        {/* Main Content */}
        <Box component="main" sx={{ flexGrow: 1, overflow: 'auto' }}>
          {currentView === 'home' && <VoiceInterface />}
          {currentView === 'rates' && <LiveRatesPage />}
          {currentView === 'chat' && <VendorChatPage />}
          {currentView === 'marketplace' && <MarketplacePage />}
          {currentView === 'list' && <VendorListingPage />}
        </Box>

        {/* Footer */}
        <Footer />
      </Box>
  );
}

function App() {
  return (
    <ThemeProvider theme={hariyaliTheme}>
      <CssBaseline />
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;