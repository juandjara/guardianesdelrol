import supabase from '@/lib/db-client/supabaseAdmin'
import { v4 as uuid } from 'uuid'

export default async function createGuest(req, res) {
  const name = req.body.name
  const { data, error } = await supabase
    .from('users')
    .insert([{ id: uuid(), name, email: 'guest' }])
    .single()

  if (error) {
    res.status(500).json({ ...error, message: error.message })
    return
  }

  res.json(data)
}
