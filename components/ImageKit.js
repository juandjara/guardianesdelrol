export default function ImageKit({ style, className = '', src, width, height, alt }) {
  let url = `${process.env.NEXT_PUBLIC_IMAGEKIT_URL}/${src}`
  let url1x = ''
  let url2x = ''
  const size = []
  const size2x = []
  if (width) {
    size.push(`w-${width}`)
    size2x.push(`w-${width * 2}`)
  }
  if (height) {
    size.push(`h-${height}`)
    size2x.push(`h-${height * 2}`)
  }
  if (size.length) {
    url1x = url + `?tr=${size.join(',')}`
    url2x = url + `?tr=${size2x.join(',')}`
  }
  return (
    <img
      style={style}
      className={className}
      width={width}
      height={height}
      alt={alt}
      src={url1x ? '' : url}
      srcSet={url2x ? `${url1x} 1x, ${url2x} 2x` : ''}
      decoding="async"
      loading="lazy"
    />
  )
}
