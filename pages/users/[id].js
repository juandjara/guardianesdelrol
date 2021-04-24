import UserDetail from '@/components/users/UserDetail'
import useAuthGuard from '@/lib/auth/useAuthGuard'

export default function UserDetails() {
  useAuthGuard()
  return (
    <main className="flex-auto my-4 px-3 w-full max-w-screen-lg mx-auto">
      <UserDetail />
    </main>
  )
}
