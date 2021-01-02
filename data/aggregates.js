import admin from '@/lib/firebaseAdmin'

export async function getAggregates() {
  console.log('computing aggregates...')
  const db = admin.firestore()
  const postsRef = await db.collection('posts').get()

  const posts = postsRef.docs.map(p => p.data())
  const narrators = new Set()
  const games = new Set()

  for (const post of posts) {
    const narrator = post.narrator.email
    const game = post.game

    if (!narrators.has(narrator)) {
      narrators.add(narrator)
    }
    if (!games.has(game)) {
      games.add(game)
    }
  }

  return {
    posts: posts.length,
    narrators: Array.from(narrators).length,
    games: Array.from(games).length
  }
}
