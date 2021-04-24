import { useQueryParams } from '@/lib/useQueryParams'
import useUsers, { DEFAULT_RPP } from '@/lib/users/useUsers'
import { useRouter } from 'next/router'
import Pagination from '../Pagination'
import SearchBox from '../SearchBox'
import Tag from '../Tag'
import UserFiltersPanel from './UserFiltersPanel'
import UserListItem from './UserListItem'

export default function UserList({ showAccessColumn, className = '', style = {} }) {
  const router = useRouter()
  const { query, params } = useQueryParams()
  const { users, count } = useUsers(query)
  const page = Number(params.page || 0)
  const rpp = Number(params.rpp || DEFAULT_RPP)

  function isSelected({ id }) {
    return id === params.id
  }

  function handlePageChange(page) {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, page }
    })
  }

  return (
    <>
      <div className="relative flex items-end mb-2">
        <h1 className="flex items-center text-xl font-semibold tracking-wide space-x-3">
          <Tag color="red">{count}</Tag>
          <span>Usuarios</span>
        </h1>
        <div className="flex-auto"></div>
        <SearchBox route="/users" />
        <UserFiltersPanel />
      </div>
      <div style={style} className={`${className} rounded-lg bg-white text-gray-700`}>
        <header
          className={`${
            showAccessColumn ? 'hidden md:flex' : 'hidden'
          } px-3 border-b border-gray-300 sticky top-0 z-10 flex space-x-2 bg-white`}>
          <p className="text-sm flex-1">Usuario</p>
          <p className="text-sm">Ultimo acceso</p>
        </header>
        <ul className="">
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
      <Pagination onChange={handlePageChange} page={page} rpp={rpp} count={count} />
    </>
  )
}
