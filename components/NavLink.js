import { useRouter } from 'next/router'
import Link from 'next/link'

// taken from here: https://github.com/vercel/next.js/blob/canary/examples/active-class-name/components/ActiveLink.js
export default function NavLink({
  href,
  display = 'inline-block',
  active = false,
  children,
  as,
  className = ''
}) {
  const { asPath } = useRouter()

  // props.href will be matched by routes like `/catalog`
  // props.as will be matched by routes like `/posts/1234`
  const routeActive = asPath.indexOf(href) !== -1 || asPath.indexOf(as) !== -1
  const style = `my-1 py-1 px-3 ${display} rounded-md border-b-2 border-transparent text-white text-lg  hover:no-underline`
  const activeStyle =
    active || routeActive ? 'bg-red-500 bg-opacity-75' : 'hover:bg-red-500 hover:bg-opacity-75'

  return (
    <Link href={href} as={as}>
      <a className={`${style} ${activeStyle} ${className}`}>{children}</a>
    </Link>
  )
}
