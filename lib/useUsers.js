import useSWR from 'swr'
import { useEffect } from 'react'
import { useAlert } from './AlertContext'
import { useSession } from './UserContext'
import { supabase } from './supabase'

async function fetcher() {
  const { error, data } = await supabase.from('users_with_permissions').select(`
    id,
    email,
    displayName:display_name,
    photoURL:photo_url,
    challengeable,
    role
  `)
  if (error) {
    throw error
  } else {
    return data
  }
}

export default function useUsers() {
  const { user } = useSession()
  const { setAlert } = useAlert()
  const { data, error } = useSWR(user ? 'user-list' : null, fetcher)

  useEffect(() => {
    if (error) {
      setAlert(error)
    }
  }, [setAlert, error])

  return {
    users: data,
    isLoading: !error && !data,
    isError: error
  }
}
