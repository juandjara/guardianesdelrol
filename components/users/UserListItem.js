import GnomeIcon from '@/components/icons/GnomeIcon'
import Tag from '@/components/Tag'
import Skeleton from 'react-loading-skeleton'
import Image from 'next/image'
import Link from 'next/link'

function getTag(user) {
  if (user?.superadmin) {
    return <Tag>SUPERADMIN</Tag>
  }
  if (user?.admin) {
    return <Tag>ADMIN</Tag>
  }
  return null
}

function formatDate(n) {
  if (!n) {
    return null
  }
  const date = new Date(n).toLocaleDateString()
  const hours = new Date(n).getHours()
  const minutes = new Date(n).getMinutes()
  return `${date} ${hours}:${minutes >= 10 ? minutes : `0${minutes}`}`
}

export default function UserListItem({ user, selected }) {
  return (
    <li>
      <Link href={`/users/${user?.id || ''}`}>
        <a
          className={`${
            selected ? 'font-semibold bg-gray-100' : ''
          } hover:bg-gray-100 hover:no-underline text-gray-700 py-2 px-3 md:px-4 flex items-center space-x-2 md:space-x-4`}>
          {user ? (
            <div
              className={`${
                selected ? 'border-red-900' : 'border-red-100'
              } flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-full border-2`}>
              {user.photoURL ? (
                <Image className="rounded-full" src={user.photoURL} width={64} height={64} />
              ) : (
                <GnomeIcon width={40} height={40} />
              )}
            </div>
          ) : (
            <Skeleton width={64} height={64} circle />
          )}
          <div className="truncate flex-auto">
            <p className="font-semibold">
              <span>{user ? user.displayName : <Skeleton />} </span>
              {getTag(user)}
            </p>
            <p className="text-sm truncate text-gray-500">{user?.email || <Skeleton />}</p>
            <p className="text-sm md:hidden block">
              {user ? `ultimo login ${formatDate(user.lastSignInTime)}` : <Skeleton />}
            </p>
          </div>
          <p className="text-sm text-right md:block hidden">
            {formatDate(user?.lastSignInTime) || <Skeleton />}
          </p>
        </a>
      </Link>
    </li>
  )
}
