import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html'
import { supabase } from '@/lib/data/supabase'
import useSWR from 'swr'
import { useAlert } from '@/components/AlertContext'
import { useEffect } from 'react'

export async function fetchPostDetail(key = '') {
  const id = key.replace('post-detail/', '')
  if (!id) {
    return null
  }
  const { data, error } = await supabase
    .from('posts')
    .select('*, section(id,name), game(id,name,slug), narrator, players')
    .match({ id })
    .single()

  if (error && error.name !== 'AbortError') {
    console.error(error)
    throw error
  }

  const description =
    data.description.substr(0, 7) === '{"ops":'
      ? new QuillDeltaToHtmlConverter(JSON.parse(data.description).ops, {}).convert()
      : data.description

  return {
    ...data,
    description
  }
}

export default function usePostDetail(id) {
  const { setAlert } = useAlert()
  const { data, error } = useSWR(`post-detail/${id || ''}`, fetchPostDetail)

  useEffect(() => {
    if (error) {
      setAlert(error.message)
    }
  }, [setAlert, error])

  return {
    data,
    error,
    loading: !data && !error
  }
}
