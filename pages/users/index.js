import UserList from '@/components/users/UserList'
import useAuthGuard from '@/lib/auth/useAuthGuard'

export default function Users() {
  useAuthGuard()
  return (
    <main className="flex-auto my-4 container mx-auto px-3">
      <UserList showAccessColumn className="overflow-auto rounded-lg" />
    </main>
  )
}
