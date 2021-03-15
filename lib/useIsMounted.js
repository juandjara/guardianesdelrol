// taken from here: https://github.com/jmlweb/isMounted/blob/master/index.es.js
import { useRef, useEffect } from 'react'

export default function useIsMounted() {
  const isMounted = useRef(false)
  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])
  return isMounted
}
