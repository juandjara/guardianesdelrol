import useSWR from 'swr'
import { supabase } from '@/lib/data/supabase'

export const DEFAULT_RPP = 15

export async function fetchPosts(key) {
  const query = key.split('?')[1] || ''
  const params = Object.fromEntries(new URLSearchParams(query))
  const page = Number(params.page || 0)
  const rpp = Number(params.rpp) || DEFAULT_RPP
  const { q, s, t, ofs, sd, ed, sk, st } = params

  let queryBuilder = supabase
    .from('posts')
    .select(
      `
      id,
      name,
      slug,
      tags,
      seats,
      date,
      time,
      type,
      image,
      place,
      place_link,
      section(id,name),
      game(id,name,slug),
      has_free_seats,
      players,
      narrator
      `,
      { count: 'exact' }
    )
    .order('date.desc.nullsfirst,time.desc.nullsfirst,id', { ascending: false, nullsFirst: true })
    .range(page * rpp, (page + 1) * rpp - 1)

  if (q) {
    queryBuilder = queryBuilder.filter('name', 'ilike', `%${q}%`)
  }
  if (s) {
    queryBuilder = queryBuilder.filter('section', 'eq', s)
  }
  if (t) {
    queryBuilder = queryBuilder.filter('type', 'eq', t)
  }
  if (ofs) {
    queryBuilder = queryBuilder.filter('has_free_seats', 'is', 'true')
  }
  if (sd) {
    queryBuilder = queryBuilder.filter('date', 'gte', sd)
  }
  if (ed) {
    queryBuilder = queryBuilder.filter('date', 'lte', ed)
  }
  const sorttype = st || 'desc'
  if (sk) {
    queryBuilder = queryBuilder.order(
      `${sk}.${sorttype}.nullsfirst,date.${sorttype}.nullsfirst,time`,
      { ascending: st === 'asc', nullsFirst: true }
    )
  } else {
    queryBuilder = queryBuilder.order(
      `date.${sorttype}.nullsfirst,time.${sorttype}.nullsfirst,id`,
      { ascending: st === 'asc', nullsFirst: true }
    )
  }

  const { count, data: rows, error } = await queryBuilder

  if (error) {
    console.error(error)
    throw error
  }

  return { rows, count }
}

export default function usePosts(query) {
  const key = `post-list?${query || ''}`
  const { data, error } = useSWR(key, fetchPosts)

  return {
    posts: data?.rows || [],
    count: data?.count || 0,
    loading: !data && !error,
    error
  }
}
