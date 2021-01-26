import Gravatar from '@gravatar/js'
import { useMemo } from 'react'

export default function useGravatar({ email, size }) {
  return useMemo(
    () => email && Gravatar({ md5Hash: email, size, protocol: 'https', defaultImage: 'wavatar' }),
    [size, email]
  )
}
