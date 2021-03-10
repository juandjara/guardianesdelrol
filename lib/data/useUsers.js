import useSWR from 'swr'
import { useEffect } from 'react'
import { useAlert } from '../../components/AlertContext'
import { useSession } from '../auth/UserContext'
import { supabase } from './supabase'

export const DEFAULT_RPP = 10

export async function fetchUsers(key) {
  const query = key.split('?')[1] || ''
  const params = Object.fromEntries(new URLSearchParams(query))
  const page = Number(params.page || 0)
  const rpp = Number(params.rpp) || DEFAULT_RPP
  const { q } = params

  let queryBuilder = supabase
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
    .range(page * rpp, (page + 1) * rpp - 1)

  if (q) {
    queryBuilder = queryBuilder.filter('display_name', 'plfts', decodeURIComponent(q))
  }

  const { count, data: rows, error } = await queryBuilder

  if (error && error.name !== 'AbortError') {
    console.error(error)
    throw error
  }

  return { rows, count }
}

export default function useUsers(query) {
  const session = useSession()
  const key = session ? `profile?${query || ''}` : null
  const { data, error } = useSWR(key, fetchUsers)
  const { setAlert } = useAlert()

  useEffect(() => {
    if (error) {
      setAlert(error.message)
    }
  }, [setAlert, error])

  return {
    count: data?.count,
    users: data?.rows,
    isLoading: !error && !data,
    isError: error
  }
}
