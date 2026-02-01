/**
 * Live Rates Page - Shows prices across all states
 */

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from '@mui/material';
import { TrendingUp, TrendingDown, Remove } from '@mui/icons-material';
import { STATES, getPricesByState } from '../data/expandedPrices';

export const LiveRatesPage: React.FC = () => {
  const [selectedState, setSelectedState] = useState(STATES[0]);

  const statePrices = getPricesByState(selectedState);

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp sx={{ color: '#4CAF50', fontSize: 20 }} />;
    if (trend === 'down') return <TrendingDown sx={{ color: '#f44336', fontSize: 20 }} />;
    return <Remove sx={{ color: '#9e9e9e', fontSize: 20 }} />;
  };

  const getTrendColor = (trend: string) => {
    if (trend === 'up') return 'success';
    if (trend === 'down') return 'error';
    return 'default';
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
          📊 Live Mandi Rates - All India
        </Typography>

        {/* State Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs
            value={selectedState}
            onChange={(_, newValue) => setSelectedState(newValue)}
            variant="scrollable"
            scrollButtons="auto"
          >
            {STATES.map((state) => (
              <Tab key={state} label={state} value={state} />
            ))}
          </Tabs>
        </Box>

        {/* Summary Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography variant="h4" color="primary">
                  {statePrices.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Commodities Listed
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography variant="h4" color="success.main">
                  {statePrices.filter(p => p.trend === 'up').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Prices Rising
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography variant="h4" color="error.main">
                  {statePrices.filter(p => p.trend === 'down').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Prices Falling
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Price Table */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {selectedState} Mandi Prices
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'primary.main' }}>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Commodity</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Hindi Name</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }} align="right">Price Range</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Market</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }} align="center">Trend</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Category</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {statePrices.map((price) => (
                    <TableRow key={price.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="h6" sx={{ mr: 1 }}>{price.icon}</Typography>
                          <Typography variant="body1" fontWeight={600}>{price.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{price.nameHindi}</TableCell>
                      <TableCell align="right">
                        <Typography variant="body1" fontWeight={700} color="primary">
                          ₹{price.priceMin} - ₹{price.priceMax}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          per {price.unit}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{price.market}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {getTrendIcon(price.trend)}
                          <Chip
                            label={price.trend}
                            size="small"
                            color={getTrendColor(price.trend) as any}
                            sx={{ ml: 1 }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip label={price.category} size="small" variant="outlined" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Last Updated */}
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography variant="caption" color="text.secondary">
            Last updated: {new Date().toLocaleString()} | Prices updated every 30 minutes
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};
