import { supabase } from '../services/supabaseClient'

/**
 * Representa un vinicultor o productor de vinos
 */
export type Winemaker = {
  /** Identificador único del vinicultor */
  id: string
  /** Nombre completo del vinicultor o bodega */
  name: string
  /** Biografía opcional o descripción de los antecedentes y filosofía del vinicultor */
  bio?: string
  /** URL opcional de la foto de perfil del vinicultor */
  photo_url?: string
}

/**
 * Obtiene todos los vinicultores de la base de datos
 * 
 * Esta función recupera todos los perfiles de vinicultores incluyendo su información básica.
 * Útil para mostrar un directorio de todos los productores de vino en el sistema.
 * 
 * @returns Promise que se resuelve a un array de todos los vinicultores.
 *          Devuelve un array vacío si ocurre un error durante la consulta.
 * 
 * @example
 * ```typescript
 * const vinicultores = await getAllWinemakers();
 * vinicultores.forEach(productor => {
 *   console.log(`${productor.name}: ${productor.bio?.substring(0, 100)}...`);
 * });
 * ```
 */
export async function getAllWinemakers(): Promise<Winemaker[]> {
  try {
    const { data, error } = await supabase
      .from('winemakers')
      .select('id, name, bio, photo_url')
    
    if (error) {
      console.error('Error al obtener vinicultores:', error)
      return []
    }
    
    return data as Winemaker[]
  } catch (error) {
    console.error('Error en getAllWinemakers:', error)
    return []
  }
}

/**
 - Obtiene información detallada de un winemaker específico por su Primary Key (ID)
 **/
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