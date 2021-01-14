import useSWR from 'swr'
import { fetchProfile } from '@/lib/authService'
import { useSession } from '@/lib/UserContext'
import { useEffect } from 'react'

export default function useProfile(id) {
  const session = useSession()
  const key = session ? `profile/${id || session.user.id}` : null
  const { data, error, isValidating } = useSWR(key, fetchProfile)

  useEffect(() => {
    if (error) {
      console.error(error)
    }
  }, [error])

  return { user: data, error, loading: isValidating }
}
