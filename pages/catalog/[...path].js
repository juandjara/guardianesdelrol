// import useAuthGuard from '@/lib/useAuthGuard'
import useGameDetail from '@/lib/data/useGameDetail'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import Avatar from '@/components/Avatar'
import Link from 'next/link'
import Button from '@/components/Button'
import AvatarList from '@/components/AvatarList'
import FsLightbox from 'fslightbox-react'
import BackButton from '@/components/BackButton'
import Title from '@/components/Title'
import ImageKit from '@/components/ImageKit'

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
        <Link href={`/posts/${post.id}/${post.slug}`}>
          <a className="text-sm text-gray-700">{post.name}</a>
        </Link>
        <p className="text-sm text-gray-400">{numplayers} jugadores</p>
      </div>
    </li>
  )
}

export default function GameDetail() {
  // useAuthGuard()
  const router = useRouter()
  const [id, slug] = router.query.path || []
  const { data: game } = useGameDetail(id)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  useEffect(() => {
    if (game && game.slug && game.slug !== slug) {
      router.replace(`/catalog/${game.id}/${game.slug}`)
    }
  }, [router, slug, game])

  const image = game?.posts?.find(p => p.image)?.image
  const numplayers = game?.players.items.length || 0
  const numdms = game?.narrators.items.length || 0
  const numposts = game?.posts.length || 0
  const updateTime = new Date(game?.updated_at || Date.now()).toLocaleTimeString()
  const updateDate = new Date(game?.updated_at || Date.now()).toLocaleDateString()

  return (
    <main className="flex-auto mx-auto p-3 max-w-4xl w-full">
      <Title title={game?.name} />
      {image && (
        <FsLightbox
          toggler={lightboxOpen}
          sources={[`https://ik.imagekit.io/juandjara/${image}`]}
        />
      )}
      <div className="bg-white text-gray-700 pb-6 rounded-lg relative">
        <div className="z-20 w-full absolute top-0 left-0 p-2 flex items-start justify-between">
          <BackButton colors="bg-opacity-50 text-white bg-gray-500 hover:bg-opacity-75" />
          <Link href={`/catalog/edit/${id}`}>
            <a className="hover:no-underline">
              <Button small>Editar</Button>
            </a>
          </Link>
        </div>
        <div
          role="button"
          tabIndex="0"
          aria-label="Ver imagen completa"
          title="Ver imagen completa"
          onKeyUp={ev => ev.key === 'Enter' && setLightboxOpen(!lightboxOpen)}
          onClick={() => setLightboxOpen(!lightboxOpen)}
          className="aspect-w-7 aspect-h-3 relative clip-vertical bg-gray-100 rounded-t-lg">
          {image && (
            <ImageKit alt="" src={image} className="w-full h-full object-cover rounded-t-lg" />
          )}
        </div>
        <header className="px-4 my-4">
          <h1 className="text-red-700 text-xl font-semibold">{game?.name || <Skeleton />}</h1>
          <p className="max-w-prose text-base mt-2">{game?.description}</p>
        </header>
        <div className="space-y-6 p-4 pb-0">
          <div>
            <p className="text-base text-gray-400 mb-4">
              <span className="text-2xl text-gray-700 font-medium mr-1">{numplayers}</span>
              jugador{numplayers === 1 ? '' : 'es'}
            </p>
            {game && <AvatarList users={game.players.items} count={game.players.count} />}
          </div>
          <div>
            <p className="text-base text-gray-400 mb-4">
              <span className="text-2xl text-gray-700 font-medium mr-1">{numdms}</span>
              narrador{numdms === 1 ? '' : 'es'}
            </p>
            {game && <AvatarList users={game.narrators.items} count={game.narrators.count} />}
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
          <div>
            <p className="mt-8 text-sm text-gray-400">
              Actualizado el {updateDate} a las {updateTime}
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
