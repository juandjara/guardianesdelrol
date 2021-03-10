import Avatar from '@/components/Avatar'
import PostCard from '@/components/posts/PostCard'
import useAuthGuard from '@/lib/auth/useAuthGuard'
import usePostsForUser from '@/lib/data-fetch/usePostsForUsers'
import useProfile from '@/lib/data-fetch/useProfile'
import Link from 'next/link'

export default function Dashboard() {
  useAuthGuard()
  const { user } = useProfile()
  const { posts } = usePostsForUser()

  const name = (user?.displayName || '').split(' ')[0]
  let numasdm = 0
  let numasplayer = 0
  for (const post of posts) {
    if (post.narrator.id === user.id) {
      numasdm++
    } else {
      numasplayer++
    }
  }

  return (
    <main className="max-w-screen-lg w-full mx-auto flex-auto px-4">
      <header className="flex items-center justify-between my-6 mx-1">
        <Avatar size={64} user={user} />
        <div className="ml-6 flex-grow">
          <h1 className="my-1 text-4xl md:text-5xl font-semibold">Hola, {name}</h1>
          <Link href="/settings">
            <a className="my-1 text-blue-300 font-semibold text-sm">Editar perfil</a>
          </Link>
        </div>
      </header>
      <section className="my-12">
        <header className="flex items-baseline justify-between mx-1">
          <h2 id="posts" className="text-xl font-semibold">
            <span>Mis partidas</span>
            <span className="text-sm ml-2 font-medium">
              ({numasdm} narradas, {numasplayer} jugadas)
            </span>
          </h2>
          <Link href="/posts">
            <a className="text-blue-300 font-semibold text-sm">Ver todas</a>
          </Link>
        </header>
        <ul className="grid gap-4 grid-cols-cards mt-2">
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </ul>
      </section>
    </main>
  )
}
