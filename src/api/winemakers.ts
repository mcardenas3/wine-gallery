import { supabase } from '../services/supabaseClient'

export type Winemaker = {
  id: string
  name: string
  bio?: string
  photo_url?: string
}

export async function getAllWinemakers(): Promise<Winemaker[]> {
  try {
    const { data, error } = await supabase
      .from('winemakers')
      .select('id, name, bio, photo_url')
    
    if (error) {
      console.error('Error fetching winemakers:', error)
      return []
    }
    
    return data as Winemaker[]
  } catch (error) {
    console.error('Error en getAllWinemakers:', error)
    return []
  }
}

/**
 * Fetches a single winemaker by ID
 */
export async function getWinemakerById(id: string): Promise<Winemaker | null> {
  try {
    const { data, error } = await supabase
      .from('winemakers')
      .select('id, name, bio, photo_url')
      .eq('id', id)
      .single()

    if (error) {
      console.error(`Error fetching winemaker with ID ${id}:`, error)
      return null
    }
    
    return data as Winemaker
  } catch (error) {
    console.error(`Error en getWinemakerById:`, error)
    return null
  }
}