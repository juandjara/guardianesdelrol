import admin from '@/lib/firebaseAdmin'

export async function getProfiles() {
  const db = admin.firestore()
  const profilesRef = await db.collection('profiles').get()
  const authRef = await admin.auth().listUsers(1000)

  const profiles = []
  for (const user of authRef.users) {
    const profile = profilesRef.docs.find(p => p.id === user.uid) || { data: () => ({}) }
    const { admin, superadmin } = user.customClaims || {}
    profiles.push({
      id: user.uid,
      admin: admin || false,
      superadmin: superadmin || false,
      displayName: profile.data().displayName || user.displayName || null,
      photoURL: profile.data().photoURL || user.photoURL || null,
      email: user.email || null,
      lastSignInTime: new Date(user.metadata.lastSignInTime).getTime()
    })
  }

  return profiles.sort((a, b) => b.lastSignInTime - a.lastSignInTime)
}
