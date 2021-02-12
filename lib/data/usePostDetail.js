import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html'
import { supabase } from '@/lib/data/supabase'
import useSWR from 'swr'

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

  if (error) {
    console.error(error)
    throw error
  }

  const description = new QuillDeltaToHtmlConverter(JSON.parse(data.description).ops, {}).convert()

  return {
    ...data,
    description
  }
}

export default function usePostDetail(id) {
  const { data, error } = useSWR(`post-detail/${id || ''}`, fetchPostDetail)
  return {
    data,
    error,
    loading: !data && !error
  }
}
