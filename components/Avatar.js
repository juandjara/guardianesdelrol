import Image from 'next/image'
import GnomeIcon from './icons/GnomeIcon'
import Skeleton from 'react-loading-skeleton'

export default function Avatar({ user, className, size = 64, border = 'border-red-100' }) {
  const sizeCN = size / 4
  return user ? (
    <div
      className={`${border} ${className} flex-shrink-0 flex items-center justify-center w-${sizeCN} h-${sizeCN} rounded-full border-2`}>
      {user.photoURL ? (
        <Image className="rounded-full" src={user.photoURL} width={size} height={size} />
      ) : (
        <GnomeIcon width={40} height={40} />
      )}
    </div>
  ) : (
    <Skeleton className={className} width={size} height={size} circle />
  )
}
