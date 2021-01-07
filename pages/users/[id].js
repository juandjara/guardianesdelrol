import UserDetail from '@/components/users/UserDetail'
import UserList from '@/components/users/UserList'

export default function UserDetails({ data }) {
  return (
    <div className="flex-auto my-4">
      <div className="flex container mx-auto rounded-t-lg">
        <aside
          className="overflow-auto w-full max-w-sm hidden md:block"
          style={{ maxHeight: 'calc(100vh - 120px)' }}>
          <UserList compact />
        </aside>
        <UserDetail aggregates={data} />
      </div>
    </div>
  )
}
