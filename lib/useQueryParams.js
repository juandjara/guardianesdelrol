import { useMemo } from 'react'
import { useRouter } from 'next/router'

/**
 * Can't reliably extract QPs from Next's useRouter on initial client-side render.
 * taken from here: https://github.com/vercel/next.js/issues/10521
 */
export function useQueryParams() {
  const router = useRouter()

  const queryParams = useMemo(() => {
    let pathStr = ''

    const delimiterIndex = router.asPath.indexOf('?')
    if (delimiterIndex >= 0) {
      pathStr = router.asPath.substring(delimiterIndex)
    }

    return new URLSearchParams(pathStr)
  }, [router.asPath])

  return queryParams
}
