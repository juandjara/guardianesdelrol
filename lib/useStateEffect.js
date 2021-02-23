import { useEffect, useState } from 'react'

export default function useStateEffect(initialValue) {
  const [value, setValue] = useState(initialValue)
  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  return [value, setValue]
}
