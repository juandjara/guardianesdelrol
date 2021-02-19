import { useState } from 'react'

// taken from here: https://usehooks.com/useLocalStorage/
export default function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    if (typeof window === 'undefined') {
      return defaultValue
    }

    try {
      const data = window.localStorage.getItem(key)
      return data ? JSON.parse(data) : defaultValue
    } catch (err) {
      console.error(err)
      return defaultValue
    }
  })

  const setter = newValue => {
    try {
      const valueToStore = typeof newValue === 'function' ? newValue(value) : newValue
      setValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (err) {
      console.error(err)
    }
  }

  return [value, setter]
}
