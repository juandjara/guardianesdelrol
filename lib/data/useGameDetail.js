import useSWR from 'swr'
import dedupeAndCount from '../dedupeAndCount'
import { supabase } from './supabase'

export async function fetchGameDetail(key = '') {
  const id = key.replace('game-detail/', '')
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
      posts(id,slug,name,image,narrator,players)
      `
    )
    .match({ id })
    .order('date.asc,time.asc,id', { foreignTable: 'posts' })
    .single()

  if (error) {
    console.error(error)
    throw error
  }

  const narrators = dedupeAndCount(data.posts.map(p => p.narrator))
  const players = dedupeAndCount(data.posts.map(p => p.players).flat())

  return {
    ...data,
    narrators,
    players
  }
}

export default function useGameDetail(id) {
  const { data, error } = useSWR(`game-detail/${id || ''}`, fetchGameDetail)
  if (error) {
    console.error(error)
  }
  return {
    data,
    error,
    loading: !data && !error
  }
}
