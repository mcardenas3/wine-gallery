import { useEffect, useState } from 'react'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Grid from '@mui/material/Grid'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Chip from '@mui/material/Chip'
import WineCard from '../components/WineCard'
import { supabase } from '../services/supabaseClient'

type Wine = {
  id: string
  name: string
  type: string
  grape: string
  owner: string
  wine_media?: any[]
}

export default function WineGallery() {
  const [wines, setWines] = useState<Wine[]>([])
  const [loading, setLoading] = useState(true)
  const [typeFilter, setTypeFilter] = useState<string>('')
  const [grapeFilter, setGrapeFilter] = useState<string>('')
  const [uniqueTypes, setUniqueTypes] = useState<string[]>([])
  const [uniqueGrapes, setUniqueGrapes] = useState<string[]>([])

  useEffect(() => {
    async function fetchWines() {
      try {
        const { data: winesData, error } = await supabase
          .from('wines')
          .select(`
            id, name, type, grape, owner,
            wine_media (url, media_type, description)
          `)

        if (error) {
          throw error
        }

        // Extract unique types and grapes for filters
        if (winesData) {
          const types = [...new Set(winesData.map(wine => wine.type))].filter(Boolean) as string[];
          const grapes = [...new Set(winesData.map(wine => wine.grape))].filter(Boolean) as string[];
          
          setUniqueTypes(types);
          setUniqueGrapes(grapes);
          setWines(winesData);
        }
      } catch (error) {
        console.error('Error fetching wines:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchWines()
  }, [])

  // Filter wines based on selected filters
  const filteredWines = wines.filter(wine => {
    const matchesType = !typeFilter || wine.type === typeFilter;
    const matchesGrape = !grapeFilter || wine.grape === grapeFilter;
    return matchesType && matchesGrape;
  });

  // Handle filter changes
  const handleTypeFilterChange = (event: any) => {
    setTypeFilter(event.target.value);
  };

  const handleGrapeFilterChange = (event: any) => {
    setGrapeFilter(event.target.value);
  };

  // Clear filters
  const clearFilters = () => {
    setTypeFilter('');
    setGrapeFilter('');
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
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
        Wine Collection
      </Typography>
      
      {/* Filters section */}
      <Box sx={{ mb: 6 }}>
        {/* Filter selects - placed in separate containers to avoid overlapping */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          gap: 2, 
          mb: 3
        }}>
          <FormControl sx={{ minWidth: 200 }} size="small" fullWidth={false}>
            <InputLabel id="wine-type-label">Wine Type</InputLabel>
            <Select
              labelId="wine-type-label"
              id="wine-type-select"
              value={typeFilter}
              label="Wine Type"
              onChange={handleTypeFilterChange}
            >
              <MenuItem value="">All Types</MenuItem>
              {uniqueTypes.map(type => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl sx={{ minWidth: 200 }} size="small" fullWidth={false}>
            <InputLabel id="grape-label">Grape</InputLabel>
            <Select
              labelId="grape-label"
              id="grape-select"
              value={grapeFilter}
              label="Grape"
              onChange={handleGrapeFilterChange}
            >
              <MenuItem value="">All Grapes</MenuItem>
              {uniqueGrapes.map(grape => (
                <MenuItem key={grape} value={grape}>{grape}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        
        {/* Active filters */}
        {(typeFilter || grapeFilter) && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
            {typeFilter && (
              <Chip 
                label={`Type: ${typeFilter}`} 
                onDelete={() => setTypeFilter('')} 
                color="primary"
                variant="outlined"
                sx={{ borderColor: '#d6d3d1', color: '#44403c' }}
              />
            )}
            {grapeFilter && (
              <Chip 
                label={`Grape: ${grapeFilter}`} 
                onDelete={() => setGrapeFilter('')}
                color="primary"
                variant="outlined"
                sx={{ borderColor: '#d6d3d1', color: '#44403c' }}
              />
            )}
            <Chip 
              label="Clear all" 
              onClick={clearFilters} 
              color="secondary"
              variant="outlined"
              sx={{ borderColor: '#d6d3d1', color: '#44403c' }}
            />
          </Box>
        )}
        
        {/* Results count */}
        <Typography 
          variant="body1" 
          sx={{ mt: 3, color: '#57534e' }}
        >
          {filteredWines.length} {filteredWines.length === 1 ? 'wine' : 'wines'} found
        </Typography>
      </Box>
      
      {/* Wine cards */}
      <Grid container spacing={4}>
        {filteredWines.map(wine => (
          <Grid item xs={12} sm={6} md={4} key={wine.id}>
            <WineCard wine={wine} />
          </Grid>
        ))}
      </Grid>
      
      {/* No results message */}
      {filteredWines.length === 0 && (
        <Box sx={{ 
          textAlign: 'center', 
          py: 8,
          color: '#78716c'
        }}>
          <Typography variant="h6" gutterBottom>No wines match your filters</Typography>
          <Typography variant="body1">Try changing your filters or clear them to see all wines</Typography>
        </Box>
      )}
    </Container>
  )
}
