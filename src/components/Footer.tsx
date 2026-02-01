/**
 * Footer Component - Appears on all pages
 */

import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  YouTube,
  Phone,
  Email,
  LocationOn,
} from '@mui/icons-material';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#1B5E20',
        color: 'white',
        py: 4,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* About Section */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
              🌾 Mandi Mitra
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, opacity: 1, lineHeight: 1.6 }}>
              Your AI-powered assistant for fair mandi prices and smart negotiations across India.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton size="small" sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}>
                <Facebook />
              </IconButton>
              <IconButton size="small" sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}>
                <Twitter />
              </IconButton>
              <IconButton size="small" sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}>
                <Instagram />
              </IconButton>
              <IconButton size="small" sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}>
                <YouTube />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="#home" color="inherit" underline="hover" sx={{ opacity: 1, '&:hover': { opacity: 0.8 } }}>
                Home
              </Link>
              <Link href="#rates" color="inherit" underline="hover" sx={{ opacity: 1, '&:hover': { opacity: 0.8 } }}>
                Live Rates
              </Link>
              <Link href="#chat" color="inherit" underline="hover" sx={{ opacity: 1, '&:hover': { opacity: 0.8 } }}>
                Vendor Chat
              </Link>
              <Link href="#marketplace" color="inherit" underline="hover" sx={{ opacity: 1, '&:hover': { opacity: 0.8 } }}>
                Marketplace
              </Link>
              <Link href="#list" color="inherit" underline="hover" sx={{ opacity: 1, '&:hover': { opacity: 0.8 } }}>
                List Your Product
              </Link>
            </Box>
          </Grid>

          {/* Features */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Features
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="body2" sx={{ opacity: 1 }}>
                ✓ Voice-First Interface
              </Typography>
              <Typography variant="body2" sx={{ opacity: 1 }}>
                ✓ 10 Indian Languages
              </Typography>
              <Typography variant="body2" sx={{ opacity: 1 }}>
                ✓ AI Price Discovery
              </Typography>
              <Typography variant="body2" sx={{ opacity: 1 }}>
                ✓ Smart Negotiations
              </Typography>
              <Typography variant="body2" sx={{ opacity: 1 }}>
                ✓ Auto-Translation
              </Typography>
            </Box>
          </Grid>

          {/* Contact */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Contact Us
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone sx={{ fontSize: 18 }} />
                <Typography variant="body2" sx={{ opacity: 1 }}>
                  1800-XXX-XXXX
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Email sx={{ fontSize: 18 }} />
                <Typography variant="body2" sx={{ opacity: 1 }}>
                  support@mandimitra.in
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn sx={{ fontSize: 18 }} />
                <Typography variant="body2" sx={{ opacity: 1 }}>
                  New Delhi, India
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3, bgcolor: 'rgba(255,255,255,0.3)' }} />

        {/* Bottom Bar */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="body2" sx={{ opacity: 1 }}>
            © {currentYear} Mandi Mitra. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Link href="#" color="inherit" underline="hover" sx={{ opacity: 1, '&:hover': { opacity: 0.8 } }}>
              <Typography variant="body2">Privacy Policy</Typography>
            </Link>
            <Link href="#" color="inherit" underline="hover" sx={{ opacity: 1, '&:hover': { opacity: 0.8 } }}>
              <Typography variant="body2">Terms of Service</Typography>
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
