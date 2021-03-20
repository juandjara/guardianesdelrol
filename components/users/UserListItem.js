import Skeleton from 'react-loading-skeleton'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import Avatar from '../Avatar'
import RoleTags from '../RoleTags'

function formatDate(n) {
  if (!n) {
    return null
  }
  const date = new Date(n).toLocaleDateString()
  const hours = new Date(n).getHours()
  const minutes = new Date(n).getMinutes()
  return `${hours}:${minutes >= 10 ? minutes : `0${minutes}`} ${date}`
}

export default function UserListItem({ showAccessColumn, user, selected }) {
  const liRef = useRef()
  const linkRef = useRef()

  useEffect(() => {
    if (selected && liRef.current) {
      liRef.current.scrollIntoView({ behaviour: 'smooth', block: 'nearest' })
    }
  }, [selected])

  function liKeyDown(ev) {
    if (ev.key === 'Enter') {
      liClick()
    }
  }
  function liClick() {
    if (linkRef.current) {
      linkRef.current.click()
    }
  }

  return (
    <li ref={selected ? liRef : null}>
      <div
        role="button"
        tabIndex={0}
        onKeyDown={liKeyDown}
        onClick={liClick}
        className={`${
          selected ? 'bg-gray-100' : ''
        } hover:bg-gray-100 focus:bg-gray-100 hover:no-underline focus:outline-none text-gray-700 py-2 px-3 md:px-4 flex items-center space-x-3 md:space-x-4`}>
        <Avatar
          user={user}
          border={selected ? 'border-red-500' : 'border-red-500 border-opacity-25'}
        />
        <div className="truncate flex-auto space-y-1">
          <Link href={`/users/${user?.id || ''}`}>
            <a ref={linkRef} className="space-x-1 font-semibold text-gray-700 focus:outline-none">
              <span>{user ? user.displayName || 'Aventurero sin nombre' : <Skeleton />} </span>
              <RoleTags user={user} />
            </a>
          </Link>
          <p className="text-sm truncate text-gray-500">{user ? user.bio : <Skeleton />}</p>
        </div>
        <p className={`pr-1 text-sm text-right hidden ${showAccessColumn ? 'md:block' : ''}`}>
          {formatDate(user?.lastSignInTime) || <Skeleton />}
        </p>
      </div>
    </li>
  )
}
