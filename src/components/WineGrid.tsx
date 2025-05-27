import { Grid } from '@mui/material'; // Use regular Grid from @mui/material
import WineCard from './WineCard';

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

export default function WineGrid({ wines }: { wines: Wine[] }) {
  if (wines.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 0' }}>
        <p style={{ color: '#6B7280', fontSize: '1.125rem' }}>No wines found in the gallery.</p>
      </div>
    )
  }

  return (
    <Grid container spacing={4} justifyContent="center">
      {wines.map(wine => (
        <Grid item key={wine.id} xs={12} sm={6} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
          <WineCard wine={wine} />
        </Grid>
      ))}
    </Grid>
  )
}
