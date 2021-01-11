import supabase from '@/lib/supabaseAdmin'

export default async function emailExistsEndpoint(req, res) {
  const email = req.query.email
  const { data } = await supabase.from('users').select('email').match({ email })

  if (data.length) {
    res.json({ email, exists: true })
  } else {
    res.json({ email, exists: false })
  }
}
