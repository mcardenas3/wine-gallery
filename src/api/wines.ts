import { supabase } from '../services/supabaseClient'

export type Media = {
  id: string
  url: string
  media_type: 'image' | 'video'
  description?: string
}

export type Wine = {
  id: string
  name: string
  type: string
  grape: string
  owner: string
  story?: string
  production?: string
  tasting_notes?: string
  place_id?: string
  winemaker_id?: string
  wine_media?: Media[]
}

export type Place = {
  id: string
  region: string
  country: string
  story?: string
}

export type Winemaker = {
  id: string
  name: string
  bio?: string
  photo_url?: string
}

/**
 - Obtiene todos los vinos con información para vistas de galería/lista
 **/
export async function getAllWines(): Promise<Wine[]> {
  const { data, error } = await supabase
    .from('wines')
    .select(`
      id, name, type, grape, owner,
      wine_media (url, media_type, description)
    `)
    .order('name')

  if (error) {
    console.error('Error fetching wines:', error)
    return []
  }
  return data as Wine[]
}

/**
 - Obtiene información detallada completa de un vino específico
 **/
export async function getWineById(id: string): Promise<Wine | null> {
  const { data, error } = await supabase
    .from('wines')
    .select(`
      id, name, type, grape, owner, 
      story, production, tasting_notes,
      place_id, winemaker_id,
      wine_media (id, url, media_type, description)
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error(`Error fetching wine with ID ${id}:`, error)
    return null
  }
  return data as Wine
}

/**
 - Obtiene todos los vinos producidos en un lugar geográfico específico
 **/
export async function getWinesByPlace(placeId: string): Promise<Wine[]> {
  const { data, error } = await supabase
    .from('wines')
    .select(`
      id, name, type, grape, owner,
      wine_media (url, media_type, description)
    `)
    .eq('place_id', placeId)
    .order('name')

  if (error) {
    console.error(`Error fetching wines for place ${placeId}:`, error)
    return []
  }
  return data as Wine[]
}

/**
 - Obtiene todos los vinos producidos por un winemaker específico
 **/
export async function getWinesByWinemaker(winemakerId: string): Promise<Wine[]> {
  const { data, error } = await supabase
    .from('wines')
    .select(`
      id, name, type, grape, owner,
      wine_media (url, media_type, description)
    `)
    .eq('winemaker_id', winemakerId)
    .order('name')

  if (error) {
    console.error(`Error fetching wines for winemaker ${winemakerId}:`, error)
    return []
  }
  return data as Wine[]
}

/**
 - Obtiene información del lugar para un vino
 **/
export async function getWinePlace(placeId: string): Promise<Place | null> {
  if (!placeId) return null
  
  const { data, error } = await supabase
    .from('places')
    .select('id, region, country')
    .eq('id', placeId)
    .single()

  if (error) {
    console.error(`Error fetching place ${placeId}:`, error)
    return null
  }
  return data as Place
}

/**
 - Obtiene información del winemaker para un vino
 **/
export async function getWineWinemaker(winemakerId: string): Promise<Winemaker | null> {
  if (!winemakerId) return null
  
  const { data, error } = await supabase
    .from('winemakers')
    .select('id, name, bio, photo_url')
    .eq('id', winemakerId)
    .single()

  if (error) {
    console.error(`Error fetching winemaker ${winemakerId}:`, error)
    return null
  }
  return data as Winemaker
}