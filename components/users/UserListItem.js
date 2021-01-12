import Tag from '@/components/Tag'
import Skeleton from 'react-loading-skeleton'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import Avatar from '../Avatar'

function formatDate(n) {
  if (!n) {
    return null
  }
  const date = new Date(n).toLocaleDateString()
  const hours = new Date(n).getHours()
  const minutes = new Date(n).getMinutes()
  return `${date} ${hours}:${minutes >= 10 ? minutes : `0${minutes}`}`
}

export default function UserListItem({ user, selected, compact }) {
  const liRef = useRef()

  useEffect(() => {
    if (selected && liRef.current) {
      liRef.current.scrollIntoView({ behaviour: 'smooth', block: 'nearest' })
    }
  }, [selected])

  return (
    <li ref={selected ? liRef : null}>
      <Link href={`/users/${user?.id || ''}`}>
        <a
          className={`${
            selected ? 'bg-gray-100' : ''
          } hover:bg-gray-100 hover:no-underline text-gray-700 py-2 px-3 md:px-4 flex items-center space-x-3 md:space-x-4`}>
          <Avatar user={user} border={selected ? 'border-red-900' : 'border-red-500'} />
          <div className="truncate flex-auto space-y-1">
            <p className="font-semibold">
              <span>{user ? user.displayName || user.email : <Skeleton />} </span>
              {user?.role && <Tag>{user.role}</Tag>}
            </p>
            <p className="text-sm truncate text-gray-500">{user ? user.bio : <Skeleton />}</p>
            <p className={`text-sm ${compact ? 'block' : 'md:hidden block'}`}>
              {user ? `ultimo login ${formatDate(user.lastSignInTime)}` : <Skeleton />}
            </p>
          </div>
          <p className={`pr-1 text-sm text-right ${compact ? 'hidden' : 'md:block hidden'}`}>
            {formatDate(user?.lastSignInTime) || <Skeleton />}
          </p>
        </a>
      </Link>
    </li>
  )
}
