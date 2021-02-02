import useSWR from 'swr'
import { supabase } from './supabase'

export async function fetchGameDetail(key, id) {
  if (!id) {
    return null
  }
  const { data, error } = await supabase
    .from('games')
    .select(
      `
      id,
      name,
      slug,
      tags,
      description,
      updated_at,
      full_posts
      `
    )
    .match({ id })
    .single()

  if (error) {
    console.error(error)
    throw error
  }

  return data
}

export default function useGameDetail(id) {
  const { data, error } = useSWR(['game-detail', id], fetchGameDetail)
  return {
    data,
    error,
    loading: !data && !error
  }
}
