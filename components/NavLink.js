import { useRouter } from 'next/router'
import Link from 'next/link'

// taken from here: https://github.com/vercel/next.js/blob/canary/examples/active-class-name/components/ActiveLink.js
export default function NavLink ({ href, children, as }) {
  const { asPath } = useRouter()

  // props.href will be matched by routes like `/catalog`
  // props.as will be matched by routes like `/posts/1234`
  const active = asPath.indexOf(href) !== -1 || asPath.indexOf(as) !== -1
  const style = 'text-white text-lg inline-block border-b-2 border-transparent py-2 px-3 hover:no-underline'
  const extra = active ? 'opacity-75 border-current' : 'hover:opacity-75 hover:border-current'

  return (
    <Link href={href} as={as}>
      <a className={`${style} ${extra}`}>{children}</a>
    </Link>
  )
}
