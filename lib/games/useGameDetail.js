import { useAlert } from '@/components/AlertContext'
import { useEffect } from 'react'
import useSWR from 'swr'
import dedupeAndCount from '../dedupeAndCount'
import { supabase } from '../db-client/supabase'

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
      image,
      image_position,
      posts(id,slug,name,narrator,players)
      `
    )
    .match({ id })
    .order('date.asc,time.asc,id', { foreignTable: 'posts' })
    .single()

  if (error && error.name !== 'AbortError') {
    if (error.details.includes('json requires 1 rows')) {
      return null
    }
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
  const { setAlert } = useAlert()
  const { data, error } = useSWR(`game-detail/${id || ''}`, fetchGameDetail)

  useEffect(() => {
    if (error) {
      setAlert(error.message)
    }
  }, [setAlert, error])

  return {
    data,
    error,
    loading: !data && !error
  }
}
