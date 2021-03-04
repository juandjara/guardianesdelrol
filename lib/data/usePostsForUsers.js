import { useAlert } from '@/components/AlertContext'
import { supabase } from '@/lib/data/supabase'
import { useEffect } from 'react'
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
  const { setAlert } = useAlert()

  useEffect(() => {
    if (error) {
      setAlert(error.message)
    }
  }, [setAlert, error])

  return {
    posts: data || [],
    error,
    loading: !data && !error
  }
}
