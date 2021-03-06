import useSWR from 'swr'
import { supabase } from '@/lib/db-client/supabase'
import { useEffect } from 'react'
import { useAlert } from '@/components/AlertContext'

export const DEFAULT_RPP = 10

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
    const _q = decodeURIComponent(q)
    queryBuilder = queryBuilder.or(`name.wfts.${_q},name.ilike.%${_q}%`)
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

  if (error && error.name !== 'AbortError') {
    console.error(error)
    throw error
  }

  return { rows, count }
}

export default function useGames(query) {
  const key = `games-list?${query || ''}`
  const { data, error } = useSWR(key, fetchGames)
  const { setAlert } = useAlert()

  useEffect(() => {
    if (error) {
      setAlert(error.message)
    }
  }, [setAlert, error])

  return {
    games: data?.rows || [],
    count: data?.count || 0,
    loading: !data && !error,
    error
  }
}
