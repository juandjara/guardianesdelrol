import { supabase } from '@/lib/data/supabase'
import useSWR from 'swr'
import { useSession } from '../auth/UserContext'

export async function fetchPostsForUser(key = '') {
  const id = key.replace('posts-for-user/', '')
  if (!id) {
    return []
  }
  const { data, error } = await supabase.rpc('posts_from_user', { userid: id })

  if (error) {
    console.error(error)
    throw error
  }

  return data
}

export default function usePostsForUser(id) {
  const session = useSession()
  const key = session ? `posts-for-user/${id || session.user.id}` : null
  const { data, error } = useSWR(key, fetchPostsForUser)
  return {
    posts: data || [],
    error,
    loading: !data && !error
  }
}
