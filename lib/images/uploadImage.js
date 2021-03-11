import { supabase } from '@/lib/db-client/supabase'
import axios from 'axios'

export default async function uploadImage({ url, filename, folder }) {
  if (!url) {
    return null
  }

  const session = supabase.auth.session()
  const formData = new FormData()
  formData.set('file', url)
  formData.set('filename', filename)
  formData.set('token', session.access_token)
  if (folder) {
    formData.set('folder', folder)
  }
  const imageResult = await axios.post('/api/upload', formData)
  return imageResult.data.name
}
