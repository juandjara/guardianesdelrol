import useSWR from 'swr'
import { fetchProfile } from '@/lib/authService'
import { useSession } from '@/lib/UserContext'
import { useEffect } from 'react'
import { useAlert } from './AlertContext'

export default function useProfile(id) {
  const { setAlert } = useAlert()
  const session = useSession()
  const key = session ? `profile/${id || session.user.id}` : null
  const { data, error, isValidating } = useSWR(key, fetchProfile)

  useEffect(() => {
    if (error) {
      console.error(error)
    }
    if (error && error.code !== 401) {
      setAlert(error.message)
    }
  }, [error, setAlert])

  return { user: data, error, loading: isValidating }
}
