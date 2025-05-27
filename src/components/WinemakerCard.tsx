import { useNavigate, useLocation } from 'react-router-dom'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import CardActionArea from '@mui/material/CardActionArea'
import { Box } from '@mui/material'
import type { Winemaker } from '../api/winemakers'

export default function WinemakerCard({ winemaker }: { winemaker: Winemaker }) {
  const navigate = useNavigate()
  const location = useLocation()

  const handleCardClick = () => {
    // Guardamos el contexto antes de navegar
    localStorage.setItem('sourcePathBeforeWinemaker', location.pathname)
    
    navigate(`/winemaker/${winemaker.id}`)
  }

  return (
    <Card
      sx={{
        width: '100%',
        height: 400,
        display: 'flex',
        flexDirection: 'column',
        transition: 'box-shadow 0.3s',
        boxShadow: 2,
        '&:hover': {
          boxShadow: 8,
        },
      }}
    >
      <CardActionArea onClick={handleCardClick} sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
        {winemaker.photo_url ? (
          <CardMedia
            component="img"
            height="200"
            image={winemaker.photo_url}
            alt={winemaker.name}
            sx={{ objectFit: 'cover' }}
          />
        ) : (
          <Box 
            sx={{ 
              height: 200, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              bgcolor: '#f5f5f4' 
            }}
          >
            <Typography variant="body1" color="text.secondary">No image available</Typography>
          </Box>
        )}
        <CardContent sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'flex-start',
          padding: 3
        }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', mb: 1 }}>
            {winemaker.name}
          </Typography>
          
          {winemaker.bio ? (
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                overflow: 'hidden', 
                textOverflow: 'ellipsis', 
                display: '-webkit-box', 
                WebkitLineClamp: 4, 
                WebkitBoxOrient: 'vertical',
                mt: 1
              }}
            >
              {winemaker.bio}
            </Typography>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              No biography available
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
