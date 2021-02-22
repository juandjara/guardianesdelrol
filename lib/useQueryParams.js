import { useMemo } from 'react'
import { useRouter } from 'next/router'

/**
 * Can't reliably extract QPs from Next's useRouter on initial client-side render.
 * taken from here: https://github.com/vercel/next.js/issues/10521
 */
export function useQueryParams() {
  const router = useRouter()

  const { query, params } = useMemo(() => {
    const query = router.asPath.split('?')[1] || ''
    const params = router.isReady ? router.query : Object.fromEntries(new URLSearchParams(query))

    return { query, params }
  }, [router.asPath, router.isReady, router.query])

  return { query, params }
}
