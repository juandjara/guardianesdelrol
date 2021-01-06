import { useAlert } from '@/lib/alerts'
import { getToken, useAuth } from '@/lib/auth'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import useSWR from 'swr'
import UserListItem from './UserListItem'

async function fetcher(url) {
  const token = await getToken()
  const res = await fetch(url, {
    headers: {
      authorization: `JWT ${token}`
    }
  })
  return await res.json()
}

export default function UserList() {
  const router = useRouter()
  const currentId = router.query.id
  const { user } = useAuth()
  const { data: users, error } = useSWR(user ? '/api/users' : null, fetcher)
  const { setAlert } = useAlert()

  function isSelected({ id }) {
    return id === currentId
  }

  useEffect(() => {
    if (error) {
      setAlert(error)
    }
  }, [setAlert, error])

  return (
    <div className="bg-white text-gray-700 rounded-lg mt-8 pb-6 container mx-auto">
      <header className="rounded-t-lg px-3 md:px-4 border-b border-gray-300 sticky top-0 z-10 flex space-x-2 md:space-x-4 bg-white">
        <p className="text-sm flex-1">Usuario</p>
        <p className="text-sm md:block hidden">Ultimo login</p>
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
          <UserListItem key={user.id} user={user} selected={isSelected(user)} />
        ))}
      </ul>
    </div>
  )
}
