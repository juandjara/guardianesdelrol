import Link from 'next/link'

export default function MenuLink ({ active, href, children, as, ...props }) {
  const style = 'hover:no-underline block px-4 py-2 text-sm'
  const extra = active ? 'text-white bg-red-600' : 'text-gray-700'

  return (
    <Link href={href} as={as}>
      <a className={`${style} ${extra}`} {...props}>{children}</a>
    </Link>
  )
}
