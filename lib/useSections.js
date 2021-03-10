import { useAlert } from '@/components/AlertContext'
import { useEffect } from 'react'
import useSWR from 'swr'
import { supabase } from './db-client/supabase'

async function fetchSections() {
  const { data, error } = await supabase.from('sections').select('*')

  if (error && error.name !== 'AbortError') {
    console.error(error)
    throw error
  }

  return data
}

export default function useSections() {
  const { data, error } = useSWR('sections', fetchSections)
  const { setAlert } = useAlert()

  useEffect(() => {
    if (error) {
      setAlert(error.message)
    }
  }, [setAlert, error])

  return {
    error,
    sections: data || [],
    loading: !data && !error
  }
}
