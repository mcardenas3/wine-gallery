import { Box, Button, Container, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function WineNotFound() {
  return (
    <Container maxWidth="lg" sx={{ py: 8, minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <Box textAlign="center">
        <Typography 
          variant="h2" 
          component="h1" 
          sx={{ 
            fontFamily: '"Playfair Display", serif',
            mb: 3,
            color: '#1c1917'
          }}
        >
          Wine not found
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
          The wine you're looking for is either unavailable or doesn't exist in our collection.
        </Typography>
        <Button 
          component={Link} 
          to="/" 
          startIcon={<ArrowBackIcon />} 
          variant="outlined"
          sx={{ 
            color: '#44403c', 
            borderColor: '#d6d3d1',
            '&:hover': {
              borderColor: '#a8a29e',
              backgroundColor: 'rgba(0,0,0,0.02)'
            }
          }}
        >
          Back to collection
        </Button>
      </Box>
    </Container>
  );
}
