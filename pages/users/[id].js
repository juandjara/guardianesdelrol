import UserDetail from '@/components/users/UserDetail'
import UserList from '@/components/users/UserList'
import useAuthGuard from '@/lib/auth/useAuthGuard'
import useRoleCheck from '@/lib/auth/useRoleCheck'
import { useRouter } from 'next/router'

export default function UserDetails() {
  useAuthGuard()
  const router = useRouter()
  const roleCheck = useRoleCheck('superadmin', router.query.id)

  return (
    <div className="flex-auto my-4">
      {roleCheck ? (
        <div
          className="flex justify-items-stretch container mx-auto"
          style={{ maxHeight: 'calc(100vh - 120px)' }}>
          <aside className="rounded-l-lg md:border-r border-gray-200 overflow-auto w-full max-w-sm hidden md:block">
            <UserList />
          </aside>
          <main className="rounded-r-lg overflow-auto w-full md:w-3/4">
            <UserDetail />
          </main>
        </div>
      ) : (
        <main className="rounded-lg mx-auto overflow-auto container max-w-screen-md">
          <UserDetail />
        </main>
      )}
    </div>
  )
}
