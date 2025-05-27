import { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  TextField, 
  Button, 
  Stack,
  Snackbar,
  Alert,
  FormGroup,
  FormControlLabel,
  Checkbox,
  styled
} from '@mui/material';

// Crear un campo de formulario personalizado
const CustomField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    '& fieldset': {
      border: 'none',
    },
    '&:hover fieldset': {
      border: 'none',
    },
    '&.Mui-focused fieldset': {
      border: 'none',
      boxShadow: '0 0 0 2px rgba(0,0,0,0.1)',
    }
  },
  '& .MuiInputBase-input': {
    padding: '16px',
  }
}));

// Crear un botón personalizado
const SubmitButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#000',
  color: '#fff',
  padding: '12px 32px',
  borderRadius: '30px',
  textTransform: 'none',
  fontSize: '16px',
  fontWeight: 500,
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: '#333',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  }
}));

export default function Contact() {
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: '',
    agreeTerms: false
  });
  
  // Form validation and submission state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Simulate API call with timeout
      setTimeout(() => {
        console.log('Form submitted:', formData);
        setIsSubmitting(false);
        setSubmitSuccess(true);
        
        // Reset form after successful submission
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          subject: '',
          message: '',
          agreeTerms: false
        });
      }, 1500);
    }
  };

  // Close success notification
  const handleCloseSnackbar = () => {
    setSubmitSuccess(false);
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Box sx={{ mb: 6 }}>
        <Typography 
          variant="h3" 
          component="h1"
          sx={{ 
            fontFamily: '"Playfair Display", serif',
            fontWeight: 500,
            mb: 2,
            textAlign: 'center'
          }}
        >
          Get in Touch
        </Typography>
        
        <Typography 
          variant="body1" 
          color="text.secondary"
          align="center"
          sx={{ maxWidth: '600px', mx: 'auto' }}
        >
          We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </Typography>
      </Box>

      <Box 
        component="form" 
        onSubmit={handleSubmit}
        sx={{
          maxWidth: '700px',
          mx: 'auto',
          p: 4,
          borderRadius: '16px',
          backgroundColor: 'white',
          boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
        }}
      >
        {/* Fila de nombre y apellido */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
          <Box sx={{ flex: 1 }}>
            <CustomField
              fullWidth
              placeholder="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              error={!!errors.firstName}
              helperText={errors.firstName}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <CustomField
              fullWidth
              placeholder="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              error={!!errors.lastName}
              helperText={errors.lastName}
            />
          </Box>
        </Box>
        
        {/* Email */}
        <Box sx={{ mb: 3 }}>
          <CustomField
            fullWidth
            placeholder="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
          />
        </Box>
        
        {/* Subject */}
        <Box sx={{ mb: 3 }}>
          <CustomField
            fullWidth
            placeholder="Subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            error={!!errors.subject}
            helperText={errors.subject}
          />
        </Box>
        
        {/* Message */}
        <Box sx={{ mb: 3 }}>
          <CustomField
            fullWidth
            placeholder="Your Message"
            name="message"
            multiline
            rows={6}
            value={formData.message}
            onChange={handleChange}
            error={!!errors.message}
            helperText={errors.message}
          />
        </Box>
        
        {/* Términos */}
        <FormGroup sx={{ mb: 3 }}>
          <FormControlLabel
            control={
              <Checkbox 
                checked={formData.agreeTerms}
                onChange={(e) => setFormData({...formData, agreeTerms: e.target.checked})}
                name="agreeTerms"
                sx={{ color: errors.agreeTerms ? 'error.main' : 'inherit' }}
              />
            }
            label={
              <Typography variant="body2" sx={{ color: errors.agreeTerms ? 'error.main' : 'inherit' }}>
                I agree to the Terms of Service and Privacy Policy
              </Typography>
            }
          />
          {errors.agreeTerms && (
            <Typography variant="caption" color="error" sx={{ ml: 2 }}>
              {errors.agreeTerms}
            </Typography>
          )}
        </FormGroup>
        
        {/* Submit button */}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <SubmitButton
            type="submit"
            disabled={isSubmitting}
            variant="contained"
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </SubmitButton>
        </Box>
      </Box>
      
      {/* Success notification */}
      <Snackbar
        open={submitSuccess}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="success"
          sx={{ width: '100%' }}
        >
          Thank you! Your message has been sent successfully.
        </Alert>
      </Snackbar>
    </Container>
  );
}
