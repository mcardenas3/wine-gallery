import { useEffect, useState } from 'react'
import { useParams, Link, useLocation } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import WineCard from '../components/WineCard'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import type { Winemaker } from '../api/winemakers'
import type { Wine } from '../components/WineCard'
import { useNavigation } from '../context/NavigationContext';

export default function WinemakerInformation() {
  const { id } = useParams<{ id: string }>();
  const { specificWineId, specificWineName, setSpecificWinemaker, sourceContext } = useNavigation();
  const location = useLocation();
  const { previousPath } = useNavigation();
  const [winemaker, setWinemaker] = useState<Winemaker | null>(null)
  const [wines, setWines] = useState<Wine[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchWinemakerData() {
      if (!id) return

      try {
        // Fetch winemaker details
        const { data: winemakerData, error: winemakerError } = await supabase
          .from('winemakers')
          .select('id, name, bio, photo_url')
          .eq('id', id)
          .single()

        if (winemakerError) {
          console.error('Error fetching winemaker:', winemakerError)
          throw winemakerError
        }

        // Fetch wines by this winemaker
        const { data: winemakerWines, error: winesError } = await supabase
          .from('wines')
          .select(`
            id, name, type, grape, owner,
            wine_media (url, media_type, description)
          `)
          .eq('winemaker_id', id)

        if (winesError) {
          console.error('Error fetching winemaker wines:', winesError)
        }

        setWinemaker(winemakerData)
        setWines(winemakerWines || [])
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchWinemakerData()
  }, [id])

  // Guardar el ID y nombre del winemaker actual para navegación
  useEffect(() => {
    if (id && winemaker) {
      setSpecificWinemaker(id, winemaker.name);
    }
  }, [id, winemaker, setSpecificWinemaker]);

  // Determinar a dónde volver - corregimos la lógica
  let backTo = '/winemakers';
  let backLabel = 'Back to winemakers';
  
  // Solo si venimos directamente de un vino específico y el contexto sigue siendo colección
  // regresamos a ese vino
  if (specificWineId && sourceContext === 'collection') {
    backTo = `/wine/${specificWineId}`;
    backLabel = specificWineName ? `Back to ${specificWineName}` : 'Back to wine';
  }
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </Box>
    )
  }

  if (!winemaker) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4">Winemaker not found</Typography>
        <Button component={Link} to="/winemakers" startIcon={<ArrowBackIcon />} sx={{ mt: 2 }}>
          Back to winemakers
        </Button>
      </Container>
    )
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
          {/* Left side - Winemaker Image */}
          <Grid item xs={12} md={4}>
            {winemaker.photo_url ? (
              <Box sx={{ 
                bgcolor: '#f5f5f4', 
                borderRadius: 1, 
                overflow: 'hidden',
                height: 400,
                width: '100%',
                mb: 2
              }}>
                <img 
                  src={winemaker.photo_url} 
                  alt={winemaker.name} 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                  }} 
                />
              </Box>
            ) : (
              <Box sx={{ 
                bgcolor: '#f5f5f4', 
                borderRadius: 1, 
                height: 400,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2
              }}>
                <Typography variant="h6" color="#a8a29e">No image available</Typography>
              </Box>
            )}

            {winemaker.region && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <LocationOnIcon fontSize="small" sx={{ mr: 1, color: '#57534e' }} />
                <Typography color="#57534e">{winemaker.region}</Typography>
              </Box>
            )}
          </Grid>
          
          {/* Right side - Winemaker Information */}
          <Grid item xs={12} md={8}>
            <Typography 
              variant="h2" 
              component="h1"
              sx={{ 
                fontFamily: '"Playfair Display", serif',
                fontWeight: 400,
                color: '#1c1917',
                mb: 4,
                fontSize: {
                  xs: '2.5rem',
                  md: '3rem'
                }
              }}
            >
              {winemaker.name}
            </Typography>
            
            {winemaker.bio && (
              <Box sx={{ mb: 6 }}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontFamily: '"Playfair Display", serif',
                    mb: 2,
                    color: '#292524',
                    fontWeight: 400
                  }}
                >
                  Biography
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: '#57534e', 
                    lineHeight: 1.7,
                    fontSize: '1rem'
                  }}
                >
                  {winemaker.bio}
                </Typography>
              </Box>
            )}
            
            {/* Wines by this winemaker */}
            <Box sx={{ mt: 6 }}>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontFamily: '"Playfair Display", serif',
                  mb: 4,
                  color: '#292524',
                  fontWeight: 400
                }}
              >
                Wines by {winemaker.name}
              </Typography>
              
              {wines.length > 0 ? (
                <Grid container spacing={4}>
                  {wines.map(wine => (
                    <Grid item xs={12} sm={6} lg={4} key={wine.id}>
                      <WineCard wine={wine} />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography color="text.secondary">
                  No wines found for this winemaker.
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}