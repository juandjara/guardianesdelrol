import { useSWRInfinite } from 'swr'
import { supabase } from '@/lib/data/supabase'

const RPP = 10
// 0-based pagination
export async function fetchPosts(key) {
  console.log(key)
  const pageQuery = key.split('/')[1]
  const [page, query] = pageQuery.split('?')
  const params = new URLSearchParams(query)
  const { count, data: rows, error } = await supabase
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
      players,
      narrator
      `,
      { count: 'exact' }
    )
    .filter('name', 'ilike', `%${params.get('q') || ''}%`)
    .order('date.desc.nullsfirst,time.desc.nullsfirst,id', { ascending: false, nullsFirst: true })
    .range(page * RPP, (page + 1) * RPP - 1)
  if (error) {
    console.error(error)
    throw error
  }

  return { rows, count }
}

export default function usePosts({ query }) {
  function getPageKey(page, prevData) {
    if (prevData && !prevData.rows.length) {
      return null
    }

    return `post-list/${page}${query}`
  }

  const { data, error, size, setSize } = useSWRInfinite(getPageKey, fetchPosts)

  const initialLoading = !data && !error
  const loading = initialLoading || (size > 0 && data && typeof data[size - 1] === 'undefined')
  const empty = data?.[0]?.rows?.length === 0
  const finished = empty || (data && data[data.length - 1]?.rows?.length < RPP)

  return { data, empty, finished, loading, page: size, setPage: setSize }
}
