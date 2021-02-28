export default function ImageKit({ style, className = '', src, width, height, alt }) {
  let url = `https://ik.imagekit.io/juandjara/${src}`
  const tr = []
  if (width) {
    tr.push(`w-${width}`)
  }
  if (height) {
    tr.push(`h-${height}`)
  }
  if (tr.length) {
    url += `?tr=${tr.join(',')}`
  }
  return (
    <img
      style={style}
      className={className}
      width={width}
      height={height}
      alt={alt}
      src={url}
      decoding="async"
      loading="lazy"
    />
  )
}
