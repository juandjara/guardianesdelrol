import Skeleton from 'react-loading-skeleton'
import ImageKit from './ImageKit'

function getInitials(text = '') {
  text = text.trim()
  const singleWord = text.indexOf(' ') === -1
  return singleWord
    ? text.slice(0, 2)
    : text
        .split(' ')
        .filter(word => ['el', 'la', 'de', 'del'].indexOf(word) === -1)
        .slice(0, 2)
        .map(s => s[0])
        .join('')
}

export default function Avatar({
  user,
  preview,
  className = '',
  size = 64,
  border = 'border-gray-100'
}) {
  const CN = `${border} ${className} bg-white relative flex-shrink-0 rounded-full border-2`
  const style = { width: size + 4, height: size + 4 }

  if (preview) {
    return (
      <div className={CN} style={style}>
        <img alt="" className="rounded-full w-full h-full object-cover" src={preview} />
      </div>
    )
  }

  if (!user) {
    return <Skeleton className={className} width={style.width} height={style.height} circle />
  }

  if (!user?.avatar) {
    const name = user.display_name || user.displayName
    const initials = getInitials(name)
    return (
      <div className={CN} style={style}>
        <img
          alt=""
          className="rounded-full"
          src={`https://avatar.tobi.sh/${name}.svg?text=${initials}`}
          width={size}
          height={size}
        />
      </div>
    )
  }

  return (
    <div className={CN} style={style}>
      <ImageKit
        alt=""
        className="rounded-full"
        src={`avatar/${user?.avatar}`}
        width={size}
        height={size}
      />
    </div>
  )
}
