import Image from 'next/image'
import Skeleton from 'react-loading-skeleton'
import useGravatar from '@/lib/useGravatar'

export default function Avatar({ user, className, size = 64, border = 'border-gray-100' }) {
  const sizeCN = size / 4
  const gravatarURL = useGravatar({ email: user?.email, size })
  return user ? (
    <div
      className={`${border} ${className} bg-white flex-shrink-0 flex items-center justify-center w-${sizeCN} h-${sizeCN} rounded-full border-2`}>
      <Image
        className="rounded-full"
        src={user.photoURL || gravatarURL}
        width={size}
        height={size}
      />
    </div>
  ) : (
    <Skeleton className={className} width={size} height={size} circle />
  )
}
