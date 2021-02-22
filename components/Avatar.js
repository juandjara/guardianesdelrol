import Image from 'next/image'
import Skeleton from 'react-loading-skeleton'
import useGravatar from '@/lib/useGravatar'
import imageKitLoader from '@/lib/imageKitLoader'

export default function Avatar({
  user,
  preview,
  className = '',
  size = 64,
  border = 'border-gray-100'
}) {
  const loader = preview || user?.avatartype === 'gravatar' ? undefined : imageKitLoader
  let src = useGravatar({ email: user?.email, size })
  if (user?.avatartype !== 'gravatar') {
    src = `/avatar/${user?.id}`
  }
  if (preview) {
    src = preview
  }

  const CN = `${border} ${className} bg-white relative flex-shrink-0 rounded-full border-2`
  const style = { width: size + 4, height: size + 4 }
  if (user?.anon) {
    return (
      <div className={CN} style={style}>
        <Image
          className="rounded-full"
          src={`https://avatar.tobi.sh/${user.display_name}`}
          width={size}
          height={size}
        />
      </div>
    )
  }

  return user ? (
    <div className={CN} style={style}>
      <Image className="rounded-full" loader={loader} src={src} width={size} height={size} />
    </div>
  ) : (
    <Skeleton className={className} width={style.width} height={style.height} circle />
  )
}
