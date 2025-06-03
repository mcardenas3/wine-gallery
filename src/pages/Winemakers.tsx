import { useEffect, useState } from 'react'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import WinemakerCard from '../components/WinemakerCard'
import { getAllWinemakers } from '../api/winemakers'
import type { Winemaker } from '../api/winemakers'

/**
 * Componente Winemakers
 * 
 * Este componente muestra una lista de todos los winemakers disponibles en la aplicación.
 * Realiza una llamada a la API para obtener los datos de los winemakers y los muestra
 * en una cuadrícula responsiva utilizando tarjetas individua
 */
export default function Winemakers() {
  const [winemakers, setWinemakers] = useState<Winemaker[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    async function fetchWinemakers() {
      try {
        const data = await getAllWinemakers()
        setWinemakers(data)
      } catch (error) {
        console.error('Error fetching winemakers:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchWinemakers()
  }, []) 

  /**
   * Renderiza un indicador de carga mientras se obtienen los datos
   */
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ minHeight: '100vh', py: 8 }}>
      <Typography 
        variant="h2" 
        component="h1" 
        align="center" 
        gutterBottom
        sx={{ 
          fontFamily: '"Playfair Display", serif',
          fontWeight: 400,
          mb: 6
        }}
      >
        Winemakers
      </Typography>
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: '1fr 1fr',
          md: '1fr 1fr 1fr'
        },
        gap: 4
      }}>
        {winemakers.map(winemaker => (
          <Box key={winemaker.id}>
            <WinemakerCard winemaker={winemaker} />
          </Box>
        ))}
      </Box>
    </Container>
  )
}
