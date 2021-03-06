import useSWR from 'swr'
import { useEffect } from 'react'
import { useAlert } from '../../components/AlertContext'
import { useSession } from '../auth/AuthContext'
import { supabase } from '../db-client/supabase'

export const DEFAULT_RPP = 50

export async function fetchUsers(key) {
  const query = key.split('?')[1] || ''
  const params = Object.fromEntries(new URLSearchParams(query))
  const page = Number(params.page || 0)
  const rpp = Number(params.rpp) || DEFAULT_RPP
  const { q, r, st, sk } = params

  let queryBuilder = supabase
    .from('users')
    .select(
      `
      id,
      email,
      is_narrator,
      lastSignInTime:last_sign_in_at,
      avatar,
      name,
      challengeable,
      role,
      bio
      `,
      { count: 'exact' }
    )
    .order(sk || 'name', { ascending: st === 'asc', nullsFirst: true })
    .range(page * rpp, (page + 1) * rpp - 1)

  if (q) {
    const _q = decodeURIComponent(q)
    queryBuilder = queryBuilder.or(`name.wfts.${_q},name.ilike.%${_q}%`)
  }

  if (r) {
    if (r === 'dm') {
      queryBuilder = queryBuilder.is('is_narrator', true)
    } else if (r === 'guest') {
      queryBuilder = queryBuilder.eq('email', 'guest')
    } else {
      queryBuilder = queryBuilder.eq('role', r)
    }
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
    users: data?.rows,
    count: data?.count,
    loading: !error && !data,
    error: error
  }
}
