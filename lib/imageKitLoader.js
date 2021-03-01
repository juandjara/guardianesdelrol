export default function imageKitLoader({ src, width, quality }) {
  const params = ['fo-auto', 'c-at_max', `w-${width}`]
  if (quality) {
    params.push(`q-${quality}`)
  }

  return `${process.env.NEXT_PUBLIC_IMAGEKIT_URL}/${src}?tr=${params.join(':')}`
}
