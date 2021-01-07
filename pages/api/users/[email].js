import { getUserAggregates } from '@/data/userAggregates'

export default async function userAggsEndpoint(req, res) {
  const email = req.query.email
  if (!email) {
    res.status(400).json({ error: 'email parametrer required' })
  }
  try {
    const data = await getUserAggregates(email)
    res.json(data)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
}
