import formidable from 'formidable'
import axios from 'axios'
import FormData from 'form-data'
import supabase from '@/lib/data/supabaseAdmin'

export const config = {
  api: {
    bodyParser: false
  }
}

const uploadURL = 'https://upload.imagekit.io/api/v1/files/upload'

export default async function uploadEndpoint(req, res) {
  const form = new formidable.IncomingForm()
  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(500).json({ description: 'Error reading input from form', err })
      return
    }
    const token = fields['token']
    const file = files['file'] || fields['file']
    const { data: user, error } = await supabase.auth.api.getUser(token)
    if (error) {
      res.status(401).json({ description: 'Error validating user token', error: error.message })
      return
    }

    const formData = new FormData()
    formData.append('folder', 'avatar')
    formData.append('fileName', user.id)
    formData.append('file', file)
    formData.append('useUniqueFileName', 'false')

    try {
      const { data } = await axios.post(uploadURL, formData, {
        headers: formData.getHeaders(),
        auth: {
          username: process.env.IMAGEKIT_PRIVATE_KEY
        }
      })
      res.json(data)
    } catch (err) {
      res.status(500).json({ description: 'Error uploading image to CDN', error: error.message })
    }
  })
}
