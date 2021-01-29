import { useSWRInfinite } from 'swr'
import { supabase } from '@/lib/supabase'

const RPP = 10
// 0-based pagination
export async function fetchGames(key, page = 0) {
  const { count, data: rows, error } = await supabase
    .from('games')
    .select(
      `
      id,
      name,
      slug,
      tags,
      posts(id,slug,name,image)
      `,
      { count: 'exact' }
    )
    .order('date.asc,time.asc,id', { foreignTable: 'posts' })
    .order('slug', { ascending: true, nullsFirst: true })
    .range(page * RPP, (page + 1) * RPP - 1)
  if (error) {
    console.error(error)
    throw error
  }

  return { rows, count }
}

function getNextPage(page, prevData) {
  if (prevData && !prevData.rows.length) {
    return null
  }
  if (page === 0) {
    return ['games-list', null]
  }

  return ['games-list', page]
}

export default function useGames(initialData) {
  const { data, error, size, setSize } = useSWRInfinite(getNextPage, fetchGames, {
    initialData: [initialData]
  })

  const initialLoading = !data && !error
  const loading = initialLoading || (size > 0 && data && typeof data[size - 1] === 'undefined')
  const empty = data?.[0]?.rows?.length === 0
  const finished = empty || (data && data[data.length - 1]?.rows?.length < RPP)

  return { data, empty, finished, loading, page: size, setPage: setSize }
}
