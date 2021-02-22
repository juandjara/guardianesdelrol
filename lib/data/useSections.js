import useSWR from 'swr'
import { supabase } from './supabase'

async function fetchSections() {
  const { data, error } = await supabase.from('sections').select('*')

  if (error) {
    console.error(error)
    throw error
  }

  return data
}

export default function useSections() {
  const { data, error } = useSWR('sections', fetchSections)

  return {
    error,
    sections: data || [],
    loading: !data && !error
  }
}
