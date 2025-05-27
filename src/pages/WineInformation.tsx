import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getWineById, getWinePlace, getWineWinemaker } from '../api/wines'
import type { Wine, Place, Winemaker, Media } from '../api/wines'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import Chip from '@mui/material/Chip'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import PersonIcon from '@mui/icons-material/Person'

export default function WineInformation() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [wine, setWine] = useState<Wine | null>(null)
  const [place, setPlace] = useState<Place | null>(null)
  const [winemaker, setWinemaker] = useState<Winemaker | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWineDetails = async () => {
      if (!id) return

      try {
        const wineData = await getWineById(id)
        setWine(wineData)

        if (wineData?.place_id) {
          const placeData = await getWinePlace(wineData.place_id)
          setPlace(placeData)
        }

        if (wineData?.winemaker_id) {
          const winemakerData = await getWineWinemaker(wineData.winemaker_id)
          setWinemaker(winemakerData)
        }
      } catch (error) {
        console.error('Error fetching wine details:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchWineDetails()
  }, [id])

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Container>
    )
  }

  if (!wine) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h5" align="center">
          Wine not found
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button 
            variant="contained" 
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/wines')}
          >
            Back to Gallery
          </Button>
        </Box>
      </Container>
    )
  }

  const firstImage = wine.wine_media?.find((m: Media) => m.media_type === 'image')
  const additionalImages = wine.wine_media?.filter((m: Media) => m.media_type === 'image').slice(1) || []

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">Wine Details</Typography>
        <Button 
          variant="outlined" 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/wines')}
        >
          Back to Gallery
        </Button>
      </Box>

      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          {/* Wine Image */}
          <Box sx={{ flex: 1 }}>
            {firstImage && (
              <Box sx={{ 
                width: '100%', 
                height: 400, 
                overflow: 'hidden', 
                borderRadius: 2,
                boxShadow: 3
              }}>
                <img 
                  src={firstImage.url} 
                  alt={wine.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </Box>
            )}
          </Box>
          
          {/* Wine Details */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h3" gutterBottom>
              {wine.name}
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {wine.type}
              </Typography>
              
              <Typography variant="body1" paragraph>
                <strong>Grape:</strong> {wine.grape}
              </Typography>
              
              <Typography variant="body1" paragraph>
                <strong>Owner:</strong> {wine.owner}
              </Typography>

              {place && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Chip 
                    icon={<LocationOnIcon />} 
                    label={`${place.region}, ${place.country}`} 
                    variant="outlined" 
                    sx={{ mr: 1 }}
                  />
                </Box>
              )}

              {winemaker && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Chip 
                    icon={<PersonIcon />} 
                    label={`Winemaker: ${winemaker.name}`} 
                    variant="outlined"
                  />
                </Box>
              )}
            </Box>

            {(wine.tasting_notes || wine.production || wine.story) && (
              <Divider sx={{ my: 2 }} />
            )}

            {wine.tasting_notes && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Tasting Notes
                </Typography>
                <Typography variant="body2">
                  {wine.tasting_notes}
                </Typography>
              </Box>
            )}

            {wine.production && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Production
                </Typography>
                <Typography variant="body2">
                  {wine.production}
                </Typography>
              </Box>
            )}

            {wine.story && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Story
                </Typography>
                <Typography variant="body2">
                  {wine.story}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Additional media gallery */}
      {additionalImages.length > 0 && (
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" gutterBottom>
            Gallery
          </Typography>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { 
              xs: '1fr', 
              sm: '1fr 1fr', 
              md: '1fr 1fr 1fr 1fr' 
            }, 
            gap: 2 
          }}>
            {additionalImages.map((media: Media, index: number) => (
              <Box 
                key={index} 
                sx={{ 
                  height: 200, 
                  borderRadius: 2, 
                  overflow: 'hidden',
                  boxShadow: 2
                }}
              >
                <img 
                  src={media.url} 
                  alt={media.description || `${wine.name} image ${index + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* Winemaker Information */}
      {winemaker && winemaker.bio && (
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            About the Winemaker
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
            {winemaker.photo_url && (
              <Box sx={{ width: { xs: '100%', sm: 200 }, height: 200 }}>
                <img 
                  src={winemaker.photo_url} 
                  alt={winemaker.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 4 }}
                />
              </Box>
            )}
            <Box>
              <Typography variant="h6" gutterBottom>
                {winemaker.name}
              </Typography>
              <Typography variant="body1">
                {winemaker.bio}
              </Typography>
            </Box>
          </Box>
        </Paper>
      )}

      {/* Place Information */}
      {place && place.story && (
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            About {place.region}, {place.country}
          </Typography>
          <Typography variant="body1">
            {place.story}
          </Typography>
        </Paper>
      )}
    </Container>
  )
} 