import { useAlert } from '@/components/AlertContext'
import { useEffect } from 'react'
import useSWR from 'swr'
import { supabase } from './db-client/supabase'

export async function createSection(name) {
  const { data, error } = await supabase.from('sections').insert([{ name }]).single()

  if (error) {
    throw error
  }

  return data
}

async function fetchSections() {
  const { data, error } = await supabase.from('sections').select('*,posts(id,slug,name,narrator)')

  if (error && error.name !== 'AbortError') {
    console.error(error)
    throw error
  }

  return data
}

export default function useSections() {
  const { data, error, mutate } = useSWR('sections', fetchSections)
  const { setAlert } = useAlert()

  useEffect(() => {
    if (error) {
      setAlert(error.message)
    }
  }, [setAlert, error])

  return {
    mutate,
    error,
    sections: data || [],
    loading: !data && !error
  }
}
