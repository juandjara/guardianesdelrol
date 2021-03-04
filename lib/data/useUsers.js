import useSWR from 'swr'
import { useEffect } from 'react'
import { useAlert } from '../../components/AlertContext'
import { useSession } from '../auth/UserContext'
import { supabase } from './supabase'

async function fetcher() {
  const { error, data } = await supabase
    .from('users')
    .select(
      `
      id,
      email,
      is_narrator,
      lastSignInTime:last_sign_in_at,
      avatartype,
      displayName:display_name,
      challengeable,
      role,
      bio
      `
    )
    .order('last_sign_in_at', { ascending: false })

  if (error && error.name !== 'AbortError') {
    console.error(error)
    throw error
  }

  return data
}

export default function useUsers() {
  const session = useSession()
  const { setAlert } = useAlert()
  const { data, error } = useSWR(session ? 'profile' : null, fetcher)

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
