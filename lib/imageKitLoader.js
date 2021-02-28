export default function imageKitLoader({ src, width, quality }) {
  const params = ['fo-auto', 'c-at_max', `w-${width}`]
  if (quality) {
    params.push(`q-${quality}`)
  }

  return `https://ik.imagekit.io/juandjara${src}?tr=${params.join(':')}`
}
