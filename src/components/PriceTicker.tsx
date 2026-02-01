/**
 * Running Price Ticker - Shows live prices scrolling in header
 */

import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { TrendingUp, TrendingDown, Remove } from '@mui/icons-material';
import { getRandomPrices, CommodityPrice } from '../data/expandedPrices';

export const PriceTicker: React.FC = () => {
  const [prices, setPrices] = useState<CommodityPrice[]>([]);

  useEffect(() => {
    // Get random prices for ticker
    setPrices(getRandomPrices(15));
    
    // Refresh every 30 seconds
    const interval = setInterval(() => {
      setPrices(getRandomPrices(15));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp sx={{ fontSize: 16, color: '#4CAF50' }} />;
    if (trend === 'down') return <TrendingDown sx={{ fontSize: 16, color: '#f44336' }} />;
    return <Remove sx={{ fontSize: 16, color: '#9e9e9e' }} />;
  };

  return (
    <Box
      sx={{
        bgcolor: '#1a1a1a',
        color: 'white',
        py: 1,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          animation: 'scroll 60s linear infinite',
          '@keyframes scroll': {
            '0%': { transform: 'translateX(0)' },
            '100%': { transform: 'translateX(-50%)' },
          },
        }}
      >
        {/* Duplicate for seamless loop */}
        {[...prices, ...prices].map((price, index) => (
          <Box
            key={`${price.id}-${index}`}
            sx={{
              display: 'flex',
              alignItems: 'center',
              mx: 3,
              whiteSpace: 'nowrap',
            }}
          >
            <Typography variant="body2" sx={{ mr: 0.5 }}>
              {price.icon}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, mr: 0.5 }}>
              {price.name}:
            </Typography>
            <Typography variant="body2" sx={{ color: '#4CAF50', mr: 0.5 }}>
              ₹{price.priceMin}-{price.priceMax}
            </Typography>
            <Typography variant="caption" sx={{ color: '#999', mr: 0.5 }}>
              /{price.unit}
            </Typography>
            {getTrendIcon(price.trend)}
            <Typography variant="caption" sx={{ color: '#666', ml: 1 }}>
              {price.state}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
