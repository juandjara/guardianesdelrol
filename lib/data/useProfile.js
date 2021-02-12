import useSWR from 'swr'
import { fetchProfile } from '@/lib/auth/authService'
import { useSession } from '@/lib/auth/UserContext'

export default function useProfile(id) {
  const session = useSession()
  const key = session ? `profile/${id || session.user.id}` : null
  const { data, error, isValidating } = useSWR(key, fetchProfile)
  return {
    user: data && {
      ...data,
      sessionEmail: session.user.email
    },
    error,
    loading: isValidating
  }
}
