import './App.css'
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import WineGallery from './pages/WineGallery'
import WineDetail from './pages/WineDetail'
import WineNotFound from './pages/WineNotFound'
import Winemakers from './pages/Winemakers'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import { useState, useEffect } from 'react'
import WinemakerInformation from './pages/WinemakerInformation'
import { NavigationProvider } from './context/NavigationContext'
import Contact from './pages/Contact'

// Create theme with Playfair Display font
const theme = createTheme({
  typography: {
    fontFamily: [
      'system-ui',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'Helvetica',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 300,
    },
    h2: {
      fontFamily: '"Playfair Display", serif',
    },
  },
});

function App() {
  const [tab, setTab] = useState(0)

  // Actualizar esta función para que navegue a la ruta correspondiente
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue)
  }

  // Agregar una función de navegación para los tabs
  const TabNavigationContent = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Actualizar el tab basado en la ruta actual
    useEffect(() => {
      if (location.pathname === '/' || location.pathname.startsWith('/wine/')) {
        setTab(0);
      } else if (location.pathname === '/winemakers' || location.pathname.startsWith('/winemaker/')) {
        setTab(1);
      } else if (location.pathname === '/about') {
        setTab(2);
      }
    }, [location.pathname]);
    
    // Manejar los cambios de tab con navegación
    const handleTabNavigation = (_event: React.SyntheticEvent, newValue: number) => {
      setTab(newValue);
      if (newValue === 0) {
        navigate('/');
      } else if (newValue === 1) {
        navigate('/winemakers');
      } else if (newValue === 2) {
        navigate('/about');
      }
    };

    return (
      <Tabs
        value={tab}
        onChange={handleTabNavigation}
        textColor="inherit"
        TabIndicatorProps={{
          style: { backgroundColor: '#44403c' }
        }}
      >
        <Tab label="Home" sx={{ color: '#44403c' }} />
        <Tab label="Winemakers" sx={{ color: '#44403c' }} />
        <Tab label="Contact" sx={{ color: '#44403c' }} />
      </Tabs>
    );
  };

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <AppBar 
          position="static" 
          color="transparent" 
          elevation={0}
          sx={{ 
            borderBottom: '1px solid rgba(0,0,0,0.1)',
            backgroundColor: '#fff'
          }}
        >
          <Container maxWidth="lg">
            <Toolbar disableGutters sx={{ py: 1 }}>
              <Typography 
                variant="h2" 
                component={Link} 
                to="/" 
                sx={{ 
                  flexGrow: 1, 
                  fontFamily: '"Playfair Display", serif', 
                  color: '#44403c',
                  textDecoration: 'none',
                  fontSize: '1.75rem',
                  fontWeight: 500,
                }}
              >
                Elegant Wine
              </Typography>
              <Box>
                <TabNavigationContent />
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
        
        <NavigationProvider>
          <Routes>
            <Route path="/" element={<WineGallery />} />
            <Route path="/wine/:id" element={<WineDetail />} />
            <Route path="/wine-not-found" element={<WineNotFound />} />
            <Route path="/winemakers" element={<Winemakers />} />
            <Route path="/winemaker/:id" element={<WinemakerInformation />} />
            <Route path="/about" element={<Contact />} />
          </Routes>
        </NavigationProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App

