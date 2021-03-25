import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Button from '@/components/Button'
import usePostDetail from '@/lib/posts/usePostDetail'
// import useAuthGuard from '@/lib/useAuthGuard'
import Link from 'next/link'
import Skeleton from 'react-loading-skeleton'
import Avatar from '@/components/Avatar'
import AvatarList from '@/components/AvatarList'
import { useSession } from '@/lib/auth/AuthContext'
import FsLightbox from 'fslightbox-react'
import { useAlert } from '@/components/AlertContext'
import UserGroupIcon from '@/components/icons/UserGroupIcon'
import PostDetailTagLine from '@/components/posts/PostDetailTagLine'
import BackButton from '@/components/BackButton'
import Title from '@/components/Title'
import ImageKit from '@/components/ImageKit'
import { addPlayer, removePlayer } from '@/lib/posts/postActions'
import useRoleCheck from '@/lib/auth/useRoleCheck'

function ActionButton({ margin, post, onAdd, onDelete, loading }) {
  const session = useSession()
  const currentId = session?.user?.id

  if (!post) {
    return null
  }

  if (post.narrator.id === currentId) {
    return null
  }

  const isPlaying = post.players.some(p => p.id === currentId)
  const isFull = post.players.length === post.seats

  if (isPlaying) {
    return (
      <Button
        disabled={loading}
        onClick={() => onDelete(currentId)}
        hasIcon="left"
        className={margin}
        color="text-red-700"
        border="border border-red-100"
        small>
        <svg
          height={20}
          width={20}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor">
          <path d="M11 6a3 3 0 11-6 0 3 3 0 016 0zM14 17a6 6 0 00-12 0h12zM13 8a1 1 0 100 2h4a1 1 0 100-2h-4z" />
        </svg>
        <span>Abandonar</span>
      </Button>
    )
  } else {
    if (isFull) {
      return null
    } else {
      return (
        <Button
          disabled={loading}
          onClick={() => onAdd(currentId)}
          border="border-none"
          color="text-white"
          background="hover:bg-blue-600 bg-blue-500"
          hasIcon="left"
          className={margin}
          small>
          <svg
            height={20}
            width={20}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor">
            <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
          </svg>
          <span>Apuntarme</span>
        </Button>
      )
    }
  }
}

export default function PostDetails() {
  const router = useRouter()
  const [id, slug] = router.query.path || []

  const { data: post } = usePostDetail(id)
  const numplayers = post?.players?.length || 0

  const roleCheck = useRoleCheck('superadmin', post?.narrator?.id)
  const { setAlert } = useAlert()
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const updateTime = post?.updated_at && new Date(post?.updated_at).toLocaleTimeString()
  const updateDate = post?.updated_at && new Date(post?.updated_at).toLocaleDateString()
  const position = post?.image_position || post?.image_position === 0 ? post?.image_position : 50

  useEffect(() => {
    if (post && post.slug && post.slug !== slug) {
      router.replace(`/posts/${post.id}/${post.slug}`)
    }
  }, [router, slug, post])

  async function handleAddPlayer(userId) {
    setLoading(true)
    try {
      await addPlayer({ userId, postId: id })
    } catch (err) {
      console.error(err)
      setAlert(err.message)
    }
    setLoading(false)
  }

  async function handleRemovePlayer(userId) {
    setLoading(true)
    try {
      await removePlayer({ userId, postId: id })
    } catch (err) {
      console.error(err)
      setAlert(err.message)
    }
    setLoading(false)
  }

  function gameLink(game) {
    return `/catalog/${game?.id}/${game?.slug}`
  }

  return (
    <main className="flex-auto mx-auto py-3 max-w-3xl w-full">
      <Title title={post?.name} />
      {post?.image && (
        <FsLightbox
          toggler={lightboxOpen}
          sources={[`${process.env.NEXT_PUBLIC_IMAGEKIT_URL}/${post.image}`]}
        />
      )}
      <div className="bg-white text-gray-700 pb-4 md:rounded-lg relative">
        <div className="z-10 w-full absolute top-0 left-0 p-2 flex items-start justify-between">
          <BackButton colors="bg-opacity-50 text-white bg-gray-500 hover:bg-opacity-75" />
          {roleCheck && (
            <Link href={`/posts/edit/${id}`}>
              <a className="hover:no-underline">
                <Button small>Editar</Button>
              </a>
            </Link>
          )}
        </div>
        <div
          role="button"
          tabIndex="0"
          aria-label="Ver imagen completa"
          title="Ver imagen completa"
          onKeyUp={ev => ev.key === 'Enter' && setLightboxOpen(!lightboxOpen)}
          onClick={() => setLightboxOpen(!lightboxOpen)}
          className="aspect-w-7 aspect-h-3 relative clip-vertical bg-gray-100 md:rounded-t-lg">
          {post?.image && (
            <ImageKit
              className="w-full h-full object-cover md:rounded-t-lg"
              style={{ objectPosition: `0 ${position}%` }}
              src={post?.image}
              alt=""
            />
          )}
        </div>
        <header className="flex flex-wrap items-baseline px-4 mt-4">
          <h1 className="text-red-700 text-xl font-semibold mr-2 mb-1">
            {post?.name || <Skeleton />}
          </h1>
          <Link href={gameLink(post?.game)}>
            <a className="text-base text-gray-500">{post?.game?.name || <Skeleton />}</a>
          </Link>
        </header>
        <div className="mt-4 mb-8 px-4">
          <p className="text-sm text-gray-500 mb-3">
            {post && (
              <span className="flex items-center">
                <UserGroupIcon className="text-gray-400 mx-1" height={24} width={24} />
                <span className="ml-2">
                  <span className="text-xl text-gray-600 font-medium mr-2">
                    {numplayers} / {post?.seats}
                  </span>
                  jugador{post?.seats === 1 ? '' : 'es'}
                </span>
              </span>
            )}
          </p>
          <AvatarList
            className={post?.players?.length === 0 ? '-ml-2' : ''}
            users={post?.players}
          />
          <ActionButton
            margin="mt-2"
            loading={loading}
            post={post}
            onAdd={handleAddPlayer}
            onDelete={handleRemovePlayer}
          />
        </div>
        <div className="px-4 mt-6">
          <PostDetailTagLine post={post} />
          <div className="mb-4 flex items-center space-x-2 p-2 bg-gray-50 rounded-md">
            <Link href={`/users/${post?.narrator?.id}`}>
              <a>
                <Avatar user={post?.narrator} size={32} />
              </a>
            </Link>
            <span className="text-sm">{post?.narrator?.name}</span>
          </div>
        </div>
        <div
          className="text-base ql-editor hyphens font-serif leading-relaxed px-4 py-0 my-4"
          dangerouslySetInnerHTML={{ __html: post?.description }}></div>
        {post?.updated_at && (
          <div>
            <p className="mt-8 px-4 text-sm text-gray-400">
              Actualizado el {updateDate} a las {updateTime}
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
