import Image from 'next/image'
import Skeleton from 'react-loading-skeleton'
import useGravatar from '@/lib/useGravatar'
import ImageKit from './ImageKit'

export default function Avatar({
  user,
  preview,
  className = '',
  size = 64,
  border = 'border-gray-100'
}) {
  const gravatar = useGravatar({ email: user?.email, size })

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

  if (!user) {
    return <Skeleton className={className} width={style.width} height={style.height} circle />
  }

  if (preview) {
    return (
      <div className={CN} style={style}>
        <img alt="" className="rounded-full w-full h-full object-cover" src={preview} />
      </div>
    )
  }

  if (user.avatartype === 'gravatar') {
    return (
      <div className={CN} style={style}>
        <img alt="" className="rounded-full" src={gravatar} />
      </div>
    )
  } else {
    return (
      <div className={CN} style={style}>
        <ImageKit
          alt=""
          className="rounded-full"
          src={`avatar/${user?.id}`}
          width={size}
          height={size}
        />
      </div>
    )
  }
}
