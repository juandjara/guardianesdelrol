// taken from here: https://dev.to/gabe_ragland/debouncing-with-react-hooks-jci
import { useEffect, useState } from 'react'

export default function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}
