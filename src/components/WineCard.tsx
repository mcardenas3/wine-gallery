import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import CardActionArea from '@mui/material/CardActionArea'
import { Box } from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom'

type Media = {
    url: string                    
    media_type: 'image' | 'video'  
    description?: string        
}
  
type Wine = {
    id: string                    
    name: string                 
    type: string                 
    grape: string               
    owner: string                  
    wine_media?: Media[]   
}
  
/**
 * Componente WineCard - Muestra una tarjeta individual para cada vino en la galería
 * Este componente recibe un objeto wine y renderiza una tarjeta con su información básica
 * y una imagen. Al hacer clic, navega a la página de detalle del vino específico.
 */
export default function WineCard({ wine }: { wine: Wine }) {
    let navigate;
    try {
      navigate = useNavigate();
    } catch (error) {
      navigate = () => console.log('Navigation not available');
    }

    const location = useLocation();

    const firstImage = wine.wine_media?.find(m => m.media_type === 'image')

    /**
     * Maneja el clic en la tarjeta del vino
     * Guarda el contexto de navegación actual y navega a la página de detalle
     */
    const handleCardClick = () => {
      try {
        localStorage.setItem('sourcePathBeforeWine', location.pathname);
        
        if (location.pathname.includes('/winemaker/')) {
          localStorage.setItem('navigationContext', 'winemakers');
        }
        
        navigate(`/wine/${wine.id}`);
      } catch (error) {
        console.log('Navigation not available', wine.id);
      }
    }

    return (
      <Card
        sx={{
          width: 360,
          height: 440,
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
          {firstImage && (
            <CardMedia
              component="img"
              height="260"
              image={firstImage.url}
              alt={wine.name}
            />
          )}
          <CardContent sx={{ 
            flexGrow: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'flex-start',
            padding: 3
          }}>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', mb: 1 }}>
              {wine.name}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 0.5 }}>
              {wine.owner ? `${wine.owner}, ${wine.grape}` : wine.grape}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
              <Typography variant="body1" color="text.secondary">{wine.type}</Typography>
              <Typography variant="h6">
                {wine.name.match(/\d{4}/) || "N/A"}
              </Typography>
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
    )
  }
