import useSWR from 'swr'
import { fetchProfile } from '@/lib/auth/authService'
import { useSession } from '@/lib/auth/AuthContext'
import { useEffect } from 'react'
import { useAlert } from '@/components/AlertContext'

export default function useProfile(id) {
  const session = useSession()
  const key = session ? `profile/${id || session.user.id}` : null
  const { data, error, isValidating } = useSWR(key, fetchProfile)
  const { setAlert } = useAlert()

  useEffect(() => {
    if (error) {
      setAlert(error.message)
    }
  }, [setAlert, error])

  return {
    user: data,
    error,
    loading: isValidating
  }
}
