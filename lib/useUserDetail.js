import useSWR from 'swr'
import { useEffect } from 'react'
import { useAlert } from './AlertContext'

async function fetcher(url) {
  const res = await fetch(url)
  return await res.json()
}

export default function useUserDetail(email) {
  const { setAlert } = useAlert()
  const { data, error } = useSWR(email ? `/api/users/${email}` : null, fetcher)

  useEffect(() => {
    if (error) {
      setAlert(error)
    }
  }, [setAlert, error])

  return {
    aggs: data,
    isLoading: !error && !data,
    isError: error
  }
}
