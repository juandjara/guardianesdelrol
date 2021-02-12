import UserDetail from '@/components/users/UserDetail'
import UserList from '@/components/users/UserList'
import useAuthGuard from '@/lib/auth/useAuthGuard'

export default function UserDetails() {
  useAuthGuard()
  return (
    <div className="flex-auto my-4">
      <div
        className="flex justify-items-stretch container mx-auto rounded-t-lg"
        style={{ maxHeight: 'calc(100vh - 120px)' }}>
        <aside className="overflow-auto w-full max-w-sm hidden md:block">
          <UserList compact />
        </aside>
        <main className="overflow-auto w-full md:w-3/4">
          <UserDetail />
        </main>
      </div>
    </div>
  )
}
