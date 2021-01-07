import { getProfiles } from '@/data/profiles'
import admin from '@/lib/firebaseAdmin'

export default async function usersEndpoint(req, res) {
  const auth = req.query.auth || req.headers.authorization.split(' ')[1]
  if (!auth) {
    res.status(401).json({ error: 'auth parameter required' })
    return
  }
  try {
    const info = await admin.auth().verifyIdToken(auth)
    if (!info.superadmin) {
      res.status(403).json({ error: 'Permission denied. Only superadmin can access this endpoint' })
      return
    }
    const data = await getProfiles()
    res.json(data)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed token verification' })
  }
}
