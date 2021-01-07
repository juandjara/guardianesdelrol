import useSWR from 'swr'
import { useEffect } from 'react'
import { useAlert } from './alerts'
import { getToken, useAuth } from './auth'

async function fetcher(url) {
  const token = await getToken()
  const res = await fetch(url, {
    headers: {
      authorization: `JWT ${token}`
    }
  })
  return await res.json()
}

export default function useUsers() {
  const { user } = useAuth()
  const { setAlert } = useAlert()
  const { data, error } = useSWR(user ? '/api/users' : null, fetcher)

  useEffect(() => {
    if (error) {
      setAlert(error)
    }
  }, [setAlert, error])

  return {
    users: data,
    isLoading: !error && !data,
    isError: error
  }
}
