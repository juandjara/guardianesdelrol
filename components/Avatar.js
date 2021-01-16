import Image from 'next/image'
import Skeleton from 'react-loading-skeleton'
import useGravatar from '@/lib/useGravatar'
import imageKitLoader from '@/lib/imageKitLoader'

export default function Avatar({
  user,
  preview,
  className,
  size = 64,
  border = 'border-gray-100'
}) {
  const loader = preview || user?.avatarType === 'gravatar' ? undefined : imageKitLoader
  let src = useGravatar({ email: user?.email, size })
  if (user?.avatarType !== 'gravatar') {
    src = `/avatar/${user?.id}`
  }
  if (preview) {
    src = preview
  }

  return user ? (
    <div
      className={`${border} ${className} bg-white flex-shrink-0 flex items-center justify-center rounded-full border-2`}>
      <Image className="rounded-full" loader={loader} src={src} width={size} height={size} />
    </div>
  ) : (
    <Skeleton className={className} width={size} height={size} circle />
  )
}
