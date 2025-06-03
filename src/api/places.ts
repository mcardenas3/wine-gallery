import { supabase } from '../services/supabaseClient'
import type { Wine } from './wines'

export type Place = {
  id: string
  region: string
  country: string
  story?: string
}

/**
 - Obtiene todos los lugares de la base de datos
 **/
export async function getAllPlaces(): Promise<Place[]> {
  const { data, error } = await supabase
    .from('places')
    .select('id, region, country, story')
    .order('region')

  if (error) {
    console.error('Error fetching places:', error)
    return []
  }
  return data as Place[]
}

/**
 - Obtiene un lugar específico por su Primary Key (ID)
 **/
export async function getPlaceById(id: string): Promise<Place | null> {
  const { data, error } = await supabase
    .from('places')
    .select('id, region, country, story')
    .eq('id', id)
    .single()

  if (error) {
    console.error(`Error fetching place with ID ${id}:`, error)
    return null
  }
  return data as Place
}

/**
 - Obtiene todos los vinos producidos en una región específica
 **/
export async function getWinesByRegion(region: string): Promise<Wine[]> {
  const { data, error } = await supabase
    .from('wines')
    .select(`
      id, name, type, grape, owner,
      wine_media (id, url, media_type, description),
      places!inner(region)
    `)
    .eq('places.region', region)
    .order('name')

  if (error) {
    console.error(`Error fetching wines from region ${region}:`, error)
    return []
  }
  return data as unknown as Wine[]
}

/**
 - Obtiene todos los vinos producidos en un país específico
 **/
export async function getWinesByCountry(country: string): Promise<Wine[]> {
  const { data, error } = await supabase
    .from('wines')
    .select(`
      id, name, type, grape, owner,
      wine_media (id, url, media_type, description),
      places!inner(country)
    `)
    .eq('places.country', country)
    .order('name')

  if (error) {
    console.error(`Error fetching wines from country ${country}:`, error)
    return []
  }
  return data as unknown as Wine[]
}