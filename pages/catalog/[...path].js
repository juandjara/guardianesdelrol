import BackIcon from '@/components/icons/BackIcon'
import imageKitLoader from '@/lib/imageKitLoader'
// import useAuthGuard from '@/lib/useAuthGuard'
import useGameDetail from '@/lib/useGameDetail'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Skeleton from 'react-loading-skeleton'
import Avatar from '@/components/Avatar'
import Link from 'next/link'
import Button from '@/components/Button'

function AvatarListItem({ user, count }) {
  const numgames = count[user.id]
  return (
    <li key={user.id} className="group relative -ml-2 mb-2">
      <Avatar border="border-gray-200" user={user} size={46} />
      <div className="px-2 transition-opacity duration-300 opacity-0 group-hover:opacity-100 h-0 group-hover:h-auto overflow-hidden absolute -left-1 bottom-full">
        <div className="p-3 bg-white rounded-xl mb-2 w-40 shadow-md">
          <Avatar className="w-16" border="border-gray-200" user={user} size={64} />
          <p className="mt-2 font-medium text-sm">{user.display_name || 'Aventurero sin nombre'}</p>
          <p className="mt-1 text-gray-400 text-sm">
            {numgames} partida{numgames === 1 ? '' : 's'}
          </p>
        </div>
      </div>
    </li>
  )
}

function PostListItem({ post }) {
  const numplayers = post.players?.length || 0
  return (
    <li key={post.id} className="flex items-center relative">
      <div className="group">
        <Avatar border="border-gray-200" user={post.narrator} size={32} />
        <div className="px-1 transition-opacity duration-300 opacity-0 group-hover:opacity-100 h-0 group-hover:h-auto overflow-hidden absolute left-9 top-2">
          <div className="px-2 py-1 bg-white rounded-md mb-2 w-full shadow-md">
            <p className="font-medium text-xs text-gray-500">{post.narrator.display_name}</p>
          </div>
        </div>
      </div>
      <div className="ml-2">
        <Link href={`/post/${post.id}/${post.slug}`}>
          <a className="text-sm text-gray-700">{post.name}</a>
        </Link>
        <p className="text-sm text-gray-400">{numplayers} jugadores</p>
      </div>
    </li>
  )
}

export default function GameList() {
  // useAuthGuard()
  const router = useRouter()
  const [id, slug] = router.query.path || []
  const { data: game } = useGameDetail(id)

  useEffect(() => {
    if (game && game.slug && game.slug !== slug) {
      router.replace(`/catalog/${game.id}/${game.slug}`)
    }
  }, [router, slug, game])

  const image = game?.posts?.find(p => p.image)?.image
  const numplayers = game?.players.items.length || 0
  const numdms = game?.narrators.items.length || 0
  const numposts = game?.posts.length || 0

  return (
    <main className="flex-auto mx-auto p-3 max-w-4xl w-full">
      <div className="bg-white text-gray-700 pb-6 rounded-lg relative">
        <div className="z-20 w-full absolute top-0 left-0 p-2 flex items-start justify-between">
          <button
            title="Volver"
            aria-label="Volver"
            onClick={() => router.back()}
            className="rounded-full p-2 bg-opacity-50 text-white bg-gray-500 hover:bg-opacity-75 focus:outline-none focus:ring focus:ring-offset-0 focus:ring-blue-500 focus:ring-offset-transparent">
            <BackIcon height={20} width={20} />
          </button>
          <Link href={`/edit/catalog/${id}`}>
            <a>
              <Button className="mx-0 my-0" small>
                Editar
              </Button>
            </a>
          </Link>
        </div>
        <div className="h-64 relative clip-vertical bg-gray-100 rounded-t-lg">
          {image && (
            <Image
              className="rounded-t-lg"
              loader={imageKitLoader}
              src={'/' + image}
              alt=""
              layout="fill"
              objectFit="cover"
            />
          )}
        </div>
        <header className="px-4 my-4">
          <h1 className="text-red-700 text-xl font-semibold">{game?.name || <Skeleton />}</h1>
          <p className="max-w-prose text-base mt-2">{game?.description}</p>
        </header>
        <div className="space-y-6 p-4">
          <div>
            <p className="text-base text-gray-400 mb-4">
              <span className="text-2xl text-gray-700 font-medium mr-1">{numplayers}</span>
              jugador{numplayers === 1 ? '' : 'es'}
            </p>
            {game && (
              <ul className="flex flex-wrap ml-2">
                {game.players.items.map(p => (
                  <AvatarListItem key={p.id} user={p} count={game.players.count} />
                ))}
              </ul>
            )}
          </div>
          <div>
            <p className="text-base text-gray-400 mb-4">
              <span className="text-2xl text-gray-700 font-medium mr-1">{numdms}</span>
              narrador{numdms === 1 ? '' : 'es'}
            </p>
            {game && (
              <ul className="flex flex-wrap ml-2">
                {game.narrators.items.map(p => (
                  <AvatarListItem key={p.id} user={p} count={game.narrators.count} />
                ))}
              </ul>
            )}
          </div>
          <div>
            <p className="text-base text-gray-400 mb-4 mr-2">
              <span className="text-2xl text-gray-700 font-medium mr-1">{numposts}</span>
              partida{numposts === 1 ? '' : 's'}
            </p>
            {game && (
              <ul className="space-y-4">
                {game?.posts.map(post => (
                  <PostListItem key={post.id} post={post} />
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
