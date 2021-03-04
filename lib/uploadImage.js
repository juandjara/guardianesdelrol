import { supabase } from '@/lib/data/supabase'
import axios from 'axios'

export default async function uploadImage({ url, filename }) {
  if (!url) {
    return null
  }

  const session = supabase.auth.session()
  const formData = new FormData()
  formData.set('file', url)
  formData.set('filename', filename)
  formData.set('token', session.access_token)
  const imageResult = await axios.post('/api/upload', formData)
  return imageResult.data.name
}