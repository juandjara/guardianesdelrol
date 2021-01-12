import UserList from '@/components/users/UserList'
import useAuthGuard from '@/lib/useAuthGuard'

export default function Users() {
  useAuthGuard()
  return (
    <main className="flex-auto my-4">
      <UserList />
    </main>
  )
}
