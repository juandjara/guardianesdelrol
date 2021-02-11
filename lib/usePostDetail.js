import { supabase } from '@/lib/supabase'
import useSWR from 'swr'

export async function fetchPostDetail(key, id) {
  if (!id) {
    return null
  }
  const { data, error } = await supabase
    .from('posts')
    .select(
      `
      id,
      name,
      slug
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

export default function usePostDetail(id) {
  const { data, error } = useSWR(['post-detail', id], fetchPostDetail)
  return {
    data,
    error,
    loading: !data && !error
  }
}
