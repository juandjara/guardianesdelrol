// import useAuthGuard from '@/lib/useAuthGuard'
import useGameDetail from '@/lib/games/useGameDetail'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import Link from 'next/link'
import Button from '@/components/Button'
import AvatarList from '@/components/AvatarList'
import FsLightbox from 'fslightbox-react'
import BackButton from '@/components/BackButton'
import Title from '@/components/Title'
import ImageKit from '@/components/ImageKit'
import PostListItem from '@/components/posts/PostListItem'

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

  const numplayers = game?.players.items.length || 0
  const numdms = game?.narrators.items.length || 0
  const numposts = game?.posts.length || 0
  const updateTime = game?.updated_at && new Date(game?.updated_at).toLocaleTimeString()
  const updateDate = game?.updated_at && new Date(game?.updated_at).toLocaleDateString()
  const position = game?.image_position || game?.image_position === 0 ? game?.image_position : 50

  return (
    <main className="flex-auto mx-auto py-3 max-w-3xl w-full">
      <Title title={game?.name} />
      {game?.image && (
        <FsLightbox
          toggler={lightboxOpen}
          sources={[`${process.env.NEXT_PUBLIC_IMAGEKIT_URL}/${game.image}`]}
        />
      )}
      <div className="bg-white text-gray-700 pb-6 md:rounded-lg relative">
        <div className="z-10 w-full absolute top-0 left-0 p-2 flex items-start justify-between">
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
          className="aspect-w-7 aspect-h-3 relative clip-vertical bg-gray-100 md:rounded-t-lg">
          {game?.image && (
            <ImageKit
              alt=""
              src={game.image}
              style={{ objectPosition: `0 ${position}%` }}
              className="w-full h-full object-cover md:rounded-t-lg"
            />
          )}
        </div>
        <header className="px-4 my-4">
          <h1 className="text-red-700 text-xl font-semibold">{game?.name || <Skeleton />}</h1>
          <div
            className="text-base mt-2 ql-editor p-0"
            dangerouslySetInnerHTML={{ __html: game?.description }}></div>
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
          {game?.updated_at && (
            <div>
              <p className="mt-8 text-sm text-gray-400">
                Actualizado el {updateDate} a las {updateTime}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
