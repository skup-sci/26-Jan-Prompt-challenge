/**
 * Marketplace - Browse vendor listings with filters
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  MenuItem,
  Button,
  Chip,
  Avatar,
} from '@mui/material';
import { Chat, LocationOn, Person } from '@mui/icons-material';
import { ALL_PRICES } from '../data/expandedPrices';

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

export const MarketplacePage: React.FC = () => {
  const [listings, setListings] = useState<VendorListing[]>([]);
  const [filteredListings, setFilteredListings] = useState<VendorListing[]>([]);
  const [selectedCommodity, setSelectedCommodity] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Load listings
  useEffect(() => {
    // Load user's own listings
    const saved = localStorage.getItem('vendorListings');
    let userListings: VendorListing[] = [];
    
    if (saved) {
      const parsed = JSON.parse(saved);
      userListings = parsed.map((l: any) => ({ ...l, timestamp: new Date(l.timestamp) }));
    }

    // Add sample vendor listings (visible to all users)
    const sampleListings: VendorListing[] = [
      {
        id: 'sample-1',
        vendorName: 'Ram Singh',
        commodity: 'Onion',
        quantity: 500,
        unit: 'kg',
        pricePerUnit: 32,
        location: 'Delhi Azadpur',
        contact: '+91 98765 43210',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      },
      {
        id: 'sample-2',
        vendorName: 'Lakshmi Devi',
        commodity: 'Tomato',
        quantity: 300,
        unit: 'kg',
        pricePerUnit: 28,
        location: 'Mumbai Vashi',
        contact: '+91 98765 43211',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      },
      {
        id: 'sample-3',
        vendorName: 'Suresh Kumar',
        commodity: 'Potato',
        quantity: 1000,
        unit: 'kg',
        pricePerUnit: 22,
        location: 'Bangalore Yeshwanthpur',
        contact: '+91 98765 43212',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      },
      {
        id: 'sample-4',
        vendorName: 'Rajesh Patel',
        commodity: 'Wheat',
        quantity: 50,
        unit: 'quintal',
        pricePerUnit: 2100,
        location: 'Gujarat Ahmedabad',
        contact: '+91 98765 43213',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      },
      {
        id: 'sample-5',
        vendorName: 'Meena Sharma',
        commodity: 'Rice',
        quantity: 30,
        unit: 'quintal',
        pricePerUnit: 3200,
        location: 'Punjab Ludhiana',
        contact: '+91 98765 43214',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      },
      {
        id: 'sample-6',
        vendorName: 'Arjun Reddy',
        commodity: 'Chili',
        quantity: 200,
        unit: 'kg',
        pricePerUnit: 85,
        location: 'Andhra Pradesh Guntur',
        contact: '+91 98765 43215',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      },
    ];

    // Combine user listings with sample listings
    const allListings = [...sampleListings, ...userListings];
    setListings(allListings);
    setFilteredListings(allListings);
  }, []);

  // Filter listings
  useEffect(() => {
    let filtered = listings;

    if (selectedCommodity !== 'all') {
      filtered = filtered.filter(l => l.commodity === selectedCommodity);
    }

    if (searchTerm) {
      filtered = filtered.filter(l =>
        l.commodity.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.vendorName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredListings(filtered);
  }, [selectedCommodity, searchTerm, listings]);

  const commodityNames = ['all', ...new Set(ALL_PRICES.map(p => p.name))].sort();

  const handleNegotiate = (listing: VendorListing) => {
    // Store selected listing for chat
    localStorage.setItem('selectedVendorListing', JSON.stringify(listing));
    // Trigger navigation to chat view
    window.dispatchEvent(new CustomEvent('navigate', { detail: 'chat' }));
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
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
          🛒 Marketplace - Browse Vendor Listings
        </Typography>

        {/* Filters */}
        <Card sx={{ mb: 3, boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Search"
                  placeholder="Search by commodity, location, or vendor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Filter by Commodity"
                  value={selectedCommodity}
                  onChange={(e) => setSelectedCommodity(e.target.value)}
                >
                  {commodityNames.map((name) => (
                    <MenuItem key={name} value={name}>
                      {name === 'all' ? 'All Commodities' : name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Results Count */}
        <Typography variant="body1" sx={{ mb: 2 }}>
          Showing {filteredListings.length} listing{filteredListings.length !== 1 ? 's' : ''}
        </Typography>

        {/* Listings Grid */}
        {filteredListings.length === 0 ? (
          <Card sx={{ boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No listings found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Try adjusting your filters or check back later for new listings
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {filteredListings.map((listing) => (
              <Grid item xs={12} sm={6} md={4} key={listing.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    {/* Vendor Info */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main', mr: 1 }}>
                        <Person />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {listing.vendorName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          <LocationOn sx={{ fontSize: 14, verticalAlign: 'middle' }} />
                          {listing.location}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Commodity */}
                    <Typography variant="h5" fontWeight={700} gutterBottom>
                      {listing.commodity}
                    </Typography>

                    {/* Price */}
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="h4" color="primary" fontWeight={700}>
                        ₹{listing.pricePerUnit}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        per {listing.unit}
                      </Typography>
                    </Box>

                    {/* Quantity */}
                    <Chip
                      label={`${listing.quantity} ${listing.unit} available`}
                      size="small"
                      sx={{ mb: 2 }}
                    />

                    {/* Contact */}
                    {listing.contact && listing.contact !== 'Not provided' && (
                      <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                        📞 {listing.contact}
                      </Typography>
                    )}

                    {/* Timestamp */}
                    <Typography variant="caption" color="text.secondary" display="block">
                      Listed: {listing.timestamp.toLocaleDateString()}
                    </Typography>
                  </CardContent>

                  {/* Negotiate Button */}
                  <Box sx={{ p: 2, pt: 0 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<Chat />}
                      onClick={() => handleNegotiate(listing)}
                      size="large"
                    >
                      Negotiate
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};
