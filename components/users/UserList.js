import { useQueryParams } from '@/lib/useQueryParams'
import useUsers from '@/lib/users/useUsers'
import UserListItem from './UserListItem'

export default function UserList({ showAccessColumn, className = '', style = {} }) {
  const { query, params } = useQueryParams()
  const { users } = useUsers(query)

  function isSelected({ id }) {
    return id === params.id
  }

  return (
    <div style={style} className={`${className} bg-white text-gray-700 pb-6`}>
      <header className="px-3 md:px-4 border-b border-gray-300 sticky top-0 z-10 flex space-x-2 md:space-x-4 bg-white">
        <p className="text-sm flex-1">Usuarios</p>
        <p className={`text-sm ${showAccessColumn ? 'md:block hidden' : 'hidden'}`}>
          Ultimo acceso
        </p>
      </header>
      <ul>
        {users ? (
          users.map(user => (
            <UserListItem
              key={user.id}
              user={user}
              showAccessColumn={showAccessColumn}
              selected={isSelected(user)}
            />
          ))
        ) : (
          <>
            <UserListItem />
            <UserListItem />
            <UserListItem />
            <UserListItem />
            <UserListItem />
          </>
        )}
      </ul>
    </div>
  )
}
