import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { 
  Container, 
  Typography, 
  Box, 
  Grid,
  Button,
  Card,
  CardMedia
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import PersonIcon from '@mui/icons-material/Person';
import { Link } from 'react-router-dom';
import { useNavigation } from '../context/NavigationContext';

export default function WineDetail() {
  const { id } = useParams<{ id: string }>();
  const [wine, setWine] = useState<Wine | null>(null);
  const [loading, setLoading] = useState(true);
  const { sourceContext, specificWinemakerId, specificWinemakerName, setSpecificWine } = useNavigation();

  useEffect(() => {
    async function fetchWine() {
      if (!id) return;
      
      try {
        console.log("Fetching wine with ID:", id); // Para depuración

        // Primero, obtengamos los datos básicos del vino
        const { data: wineData, error: wineError } = await supabase
          .from('wines')
          .select('*')
          .eq('id', id)
          .single();
          
        if (wineError) {
          console.error("Error fetching wine:", wineError);
          throw wineError;
        }

        console.log("Wine data:", wineData); // Para depuración
        
        if (!wineData) {
          setLoading(false);
          return;
        }

        // Ahora obtengamos los medios asociados al vino
        const { data: mediaData, error: mediaError } = await supabase
          .from('wine_media')
          .select('*')
          .eq('wine_id', id);
        
        if (mediaError) {
          console.error("Error fetching media:", mediaError);
        }
        
        console.log("Media data:", mediaData); // Para depuración

        // Obtengamos la información del fabricante si está disponible
        let winemakerData = null;
        if (wineData.winemaker_id) {
          const { data: maker, error: makerError } = await supabase
            .from('winemakers')
            .select('*')
            .eq('id', wineData.winemaker_id)
            .single();
          
          if (makerError) {
            console.error("Error fetching winemaker:", makerError);
          } else {
            winemakerData = maker;
          }
        }

        // Construyamos el objeto Wine completo
        const completeWine: Wine = {
          ...wineData,
          wine_media: mediaData || [],
          winemaker_name: winemakerData?.name,
          winemaker_bio: winemakerData?.biography
        };
        
        setWine(completeWine);
      } catch (error) {
        console.error('Error fetching wine details:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchWine();
  }, [id]);

  // Guardar el ID del vino actual para navegación de regreso
  useEffect(() => {
    if (id && wine) {
      setSpecificWine(id, wine.name);
    }
  }, [id, wine, setSpecificWine]);

  // Función de renderizado que usa el contexto
  const renderWineDetails = (wine: Wine) => {
    // Determinar a dónde volver
    let backTo = '/';
    let backLabel = 'Back to collection';
    
    // Solo si el contexto es de winemakers y tenemos un ID específico, volvemos a ese winemaker
    if (sourceContext === 'winemakers' && specificWinemakerId) {
      backTo = `/winemaker/${specificWinemakerId}`;
      backLabel = specificWinemakerName 
        ? `Back to ${specificWinemakerName}` 
        : 'Back to winemaker';
    } else if (sourceContext === 'winemakers') {
      // Si el contexto es winemakers pero no tenemos un ID específico
      backTo = '/winemakers';
      backLabel = 'Back to winemakers';
    }
    
    return (
      <Box sx={{ bgcolor: '#fafaf9', py: 4 }}>
        <Container maxWidth="lg">
          <Button 
            component={Link} 
            to={backTo} 
            startIcon={<ArrowBackIcon />}
            sx={{ 
              mb: 6, 
              color: '#57534e', 
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 'normal',
              pl: 0,
              '&:hover': { 
                bgcolor: 'transparent',
                color: '#292524'
              } 
            }}
          >
            {backLabel}
          </Button>
          
          <Grid container spacing={8}>
            {/* LEFT SIDE - Wine Image */}
            <Grid item xs={12} md={6} sx={{ order: { xs: 2, md: 1 } }}>
              <Box sx={{ 
                bgcolor: '#f5f5f4', 
                borderRadius: 1, 
                overflow: 'hidden',
                height: 500,
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                mb: 2
              }}>
                {mainImage ? (
                  <img 
                    src={mainImage.url} 
                    alt={wine.name} 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'contain',
                    }} 
                  />
                ) : (
                  <Box sx={{ 
                    width: '100%', 
                    height: '100%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    backgroundColor: '#e7e5e4'
                  }}>
                    <Typography variant="h6" color="#a8a29e">No image available</Typography>
                  </Box>
                )}
              </Box>
              
              {/* Thumbnail gallery with fixed size */}
              {additionalImages && additionalImages.length > 0 && (
                <Grid container spacing={2}>
                  {additionalImages.map((media, index) => (
                    <Grid item xs={4} key={index}>
                      <Card sx={{ 
                        height: 100, 
                        width: '100%',
                        bgcolor: '#f5f5f4',
                        borderRadius: 1,
                        overflow: 'hidden',
                        boxShadow: 'none'
                      }}>
                        <CardMedia
                          component="img"
                          height="100"
                          image={media.url}
                          alt={`${wine.name} view ${index + 1}`}
                          sx={{ objectFit: 'contain' }}
                        />
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Grid>
            
            {/* RIGHT SIDE - Wine Information */}
            <Grid item xs={12} md={6} sx={{ order: { xs: 1, md: 2 } }}>
              <Typography 
                variant="h2" 
                component="h1"
                sx={{ 
                  fontFamily: '"Playfair Display", serif',
                  fontWeight: 400,
                  color: '#1c1917',
                  mb: 1,
                  fontSize: {
                    xs: '2.5rem',
                    md: '3rem'
                  }
                }}
              >
                {wine.name}
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 5, 
                  color: '#57534e',
                  fontWeight: 'normal'
                }}
              >
                {wine.owner}
              </Typography>
              
              {/* Wine metadata */}
              <Grid container spacing={3} sx={{ mb: 5 }}>
                <Grid item xs={6} sm={3} md={6} lg={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocationOnIcon fontSize="small" sx={{ mr: 1, color: '#57534e' }} />
                    <Typography color="#57534e">{wine.region || 'Region not specified'}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3} md={6} lg={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CalendarTodayIcon fontSize="small" sx={{ mr: 1, color: '#57534e' }} />
                    <Typography color="#57534e">{wine.year || wine.name.match(/\d{4}/) || 'Year not specified'}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3} md={6} lg={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocalBarIcon fontSize="small" sx={{ mr: 1, color: '#57534e' }} />
                    <Typography color="#57534e">{wine.type}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3} md={6} lg={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PersonIcon fontSize="small" sx={{ mr: 1, color: '#57534e' }} />
                    <Typography color="#57534e">{wine.winemaker_name || wine.owner}</Typography>
                  </Box>
                </Grid>
              </Grid>
            
              {/* The Story */}
              {wine.story && (
                <Box sx={{ mb: 5 }}>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontFamily: '"Playfair Display", serif',
                      mb: 2,
                      color: '#292524',
                      fontWeight: 400
                    }}
                  >
                    The Story
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: '#57534e', 
                      lineHeight: 1.7,
                      fontSize: '1rem'
                    }}
                  >
                    {wine.story}
                  </Typography>
                </Box>
              )}
              
              {/* Production Process */}
              {wine.production_process && (
                <Box sx={{ mb: 5 }}>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontFamily: '"Playfair Display", serif',
                      mb: 2,
                      color: '#292524',
                      fontWeight: 400
                    }}
                  >
                    Production Process
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: '#57534e', 
                      lineHeight: 1.7,
                      fontSize: '1rem'
                    }}
                  >
                    {wine.production_process}
                  </Typography>
                </Box>
              )}
              
              {/* Tasting Notes */}
              {wine.tasting_notes && (
                <Box sx={{ mb: 5 }}>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontFamily: '"Playfair Display", serif',
                      mb: 2,
                      color: '#292524',
                      fontWeight: 400
                    }}
                  >
                    Tasting Notes
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: '#57534e', 
                      lineHeight: 1.7,
                      fontSize: '1rem'
                    }}
                  >
                    {wine.tasting_notes}
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>
          
          {/* Sección adicional para información del winemaker y región */}
          <Box sx={{ mt: 10, pt: 6, borderTop: '1px solid #e5e7eb' }}>
            <Grid container spacing={8}>
              {/* Winemaker Information */}
              <Grid item xs={12} md={6}>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontFamily: '"Playfair Display", serif',
                    mb: 4,
                    color: '#292524',
                    fontWeight: 400
                  }}
                >
                  About the Winemaker
                </Typography>
                
                {wine.winemaker_name ? (
                  <Box>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontWeight: 'medium',
                        mb: 2,
                        color: '#44403c'
                      }}
                    >
                      {wine.winemaker_name}
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: '#57534e', 
                        lineHeight: 1.7,
                        mb: 3
                      }}
                    >
                      {wine.winemaker_bio || `${wine.winemaker_name || wine.owner} is a dedicated winemaker committed to producing exceptional wines that reflect the unique terroir of the region.`}
                    </Typography>
                    {wine.winemaker_id && (
                      <Button 
                        component={Link} 
                        to={`/winemaker/${wine.winemaker_id}`} 
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
                        {`View ${wine.winemaker_name}'s profile`}
                      </Button>
                    )}
                  </Box>
                ) : (
                  <Typography color="text.secondary">
                    No winemaker information available.
                  </Typography>
                )}
              </Grid>
              
              {/* Wine Region Information */}
              <Grid item xs={12} md={6}>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontFamily: '"Playfair Display", serif',
                    mb: 4,
                    color: '#292524',
                    fontWeight: 400
                  }}
                >
                  Region
                </Typography>
                
                {wine.region ? (
                  <Box>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontWeight: 'medium',
                        mb: 2,
                        color: '#44403c'
                      }}
                    >
                      {wine.region}
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: '#57534e', 
                        lineHeight: 1.7,
                        mb: 3
                      }}
                    >
                      {`The ${wine.region} wine region is renowned for its distinctive terroir, which contributes to the unique character of the wines produced there. The combination of soil composition, climate, and traditional winemaking techniques creates wines of exceptional quality and distinct regional identity.`}
                    </Typography>
                  </Box>
                ) : (
                  <Typography color="text.secondary">
                    No region information available.
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </Box>
    );
  }

  // Si no se encuentra el vino, mostrar un mensaje y un botón para volver
  if (!wine) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4">Wine not found</Typography>
        <Button component={Link} to="/" startIcon={<ArrowBackIcon />} sx={{ mt: 2 }}>
          Back to collection
        </Button>
      </Container>
    );
  }

  const mainImage = wine.wine_media?.find(m => m.media_type === 'image');
  const additionalImages = wine.wine_media?.filter(m => m.media_type === 'image').slice(1, 4);
  
  return renderWineDetails(wine);
}
