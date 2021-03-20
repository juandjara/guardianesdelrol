import SearchBox from '@/components/SearchBox'
import UserList from '@/components/users/UserList'
import useAuthGuard from '@/lib/auth/useAuthGuard'

export default function Users() {
  useAuthGuard()
  return (
    <main className="flex-auto my-4 container mx-auto">
      <div className="flex justify-end mb-2">
        <SearchBox route="/users" />
      </div>
      <UserList showAccessColumn className="overflow-auto rounded-lg" />
    </main>
  )
}
