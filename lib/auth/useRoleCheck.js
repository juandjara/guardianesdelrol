import useProfile from '@/lib/auth/useProfile'

export default function useRoleCheck(role, id) {
  const { user } = useProfile()
  return user && (user.role === role || user.id === id)
}
