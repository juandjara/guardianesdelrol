import useSWR from 'swr'
import { supabase } from '@/lib/data/supabase'

export const DEFAULT_RPP = 20

export async function fetchGames(key) {
  const query = key.split('?')[1] || ''
  const params = Object.fromEntries(new URLSearchParams(query))
  const page = Number(params.page || 0)
  const rpp = Number(params.rpp) || DEFAULT_RPP
  const { q, sk, st, owp } = params

  let queryBuilder = supabase
    .from('games')
    .select(
      `
      id,
      name,
      slug,
      tags,
      image,
      image_position,
      posts(id,slug,name),
      post_count
      `,
      { count: 'exact' }
    )
    .order('date.asc,time.asc,id', { foreignTable: 'posts' })
    .range(page * rpp, (page + 1) * rpp - 1)

  if (q) {
    queryBuilder = queryBuilder.filter('name', 'ilike', `%${q}%`)
  }

  if (owp) {
    queryBuilder = queryBuilder.filter('post_count', 'gt', 0)
  }

  const sorttype = st || 'desc'
  if (sk) {
    queryBuilder = queryBuilder.order(`${sk}.${sorttype}.nullsfirst,post_count`, {
      ascending: st === 'asc',
      nullsFirst: true
    })
  } else {
    queryBuilder = queryBuilder.order(`post_count.${sorttype}.nullsfirst,slug`, {
      ascending: st === 'asc',
      nullsFirst: true
    })
  }

  const { count, data: rows, error } = await queryBuilder

  if (error) {
    console.error(error)
    throw error
  }

  return { rows, count }
}

export default function useGames(query) {
  const key = `games-list?${query || ''}`
  const { data, error } = useSWR(key, fetchGames)

  return {
    games: data?.rows || [],
    count: data?.count || 0,
    loading: !data && !error,
    error
  }
}
