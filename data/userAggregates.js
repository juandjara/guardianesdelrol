import admin from '@/lib/firebaseAdmin'

export async function getUserAggregates(email) {
  const db = admin.firestore()
  const postsRef = await db.collection('posts').get()
  const posts = postsRef.docs.map(p => p.data())

  const asPlayer = []
  const asNarrator = []

  for (const post of posts) {
    if (email === post.narrator.email) {
      asNarrator.push(post)
    }
    const players = post.players.map(p => p.email)
    if (players.indexOf(email) !== -1) {
      asPlayer.push(post)
    }
  }

  const gamesPlayed = Array.from(new Set(asPlayer.map(p => p.game)))
  const gamesNarrated = Array.from(new Set(asNarrator.map(p => p.game)))

  return {
    asPlayer,
    asNarrator,
    gamesPlayed,
    gamesNarrated
  }
}
