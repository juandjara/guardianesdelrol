import useUsers from '@/lib/users/useUsers'
import { useRouter } from 'next/router'
import UserListItem from './UserListItem'

export default function UserList({ compact, className = '', style = {} }) {
  const router = useRouter()
  const currentId = router.query.id
  const { users } = useUsers()

  function isSelected({ id }) {
    return id === currentId
  }

  const rootClasses = compact ? '' : 'container mx-auto'

  return (
    <div style={style} className={`${className} ${rootClasses} bg-white text-gray-700 pb-6`}>
      <header className="px-3 md:px-4 border-b border-gray-300 sticky top-0 z-10 flex space-x-2 md:space-x-4 bg-white">
        <p className="text-sm flex-1">Usuarios</p>
        <p className={`text-sm ${compact ? 'hidden' : 'md:block hidden'}`}>Ultimo acceso</p>
      </header>
      <ul>
        {!users && (
          <>
            <UserListItem />
            <UserListItem />
            <UserListItem />
            <UserListItem />
            <UserListItem />
          </>
        )}
        {(users || []).map(user => (
          <UserListItem key={user.id} user={user} compact={compact} selected={isSelected(user)} />
        ))}
      </ul>
    </div>
  )
}
