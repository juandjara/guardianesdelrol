import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Button from '@/components/Button'
import usePostDetail from '@/lib/data/usePostDetail'
import imageKitLoader from '@/lib/imageKitLoader'
import Image from 'next/image'
// import useAuthGuard from '@/lib/useAuthGuard'
import Link from 'next/link'
import Skeleton from 'react-loading-skeleton'
import Avatar from '@/components/Avatar'
import AvatarList from '@/components/AvatarList'
import { useSession } from '@/lib/auth/UserContext'
import FsLightbox from 'fslightbox-react'
import { useAlert } from '@/components/AlertContext'
import { mutate } from 'swr'
import { supabase } from '@/lib/data/supabase'
import UserGroupIcon from '@/components/icons/UserGroupIcon'
import PostDetailTags from '@/components/posts/PostDetailTags'
import BackButton from '@/components/BackButton'
import Title from '@/components/Title'

function ActionButton({ post, onAdd, onDelete, loading }) {
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
        className="mb-2 ml-2"
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
          className="mb-2 ml-2"
          small>
          <svg
            height={20}
            width={20}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor">
            <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
          </svg>
          <span>Apuntarse</span>
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

  const { setAlert } = useAlert()
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const updateTime = new Date(post?.updated_at || Date.now()).toLocaleTimeString()
  const updateDate = new Date(post?.updated_at || Date.now()).toLocaleDateString()

  useEffect(() => {
    if (post && post.slug && post.slug !== slug) {
      router.replace(`/posts/${post.id}/${post.slug}`)
    }
  }, [router, slug, post])

  async function handleAddPlayer(userId) {
    setLoading(true)
    try {
      await mutate(`post-detail/${id}`, async () => {
        const { error } = await supabase
          .from('players')
          .insert([{ post_id: post.id, user_id: userId }])
          .single()

        if (error) {
          throw error
        }
      })
    } catch (err) {
      console.error(err)
      setAlert(err.message)
    }
    setLoading(false)
  }

  async function handleRemovePlayer(userId) {
    setLoading(true)
    try {
      await mutate(`post-detail/${id}`, async () => {
        const { error } = await supabase
          .from('players')
          .delete()
          .match({ post_id: post.id, user_id: userId })

        if (error) {
          throw error
        }
      })
    } catch (err) {
      console.error(err)
      setAlert(err.message)
    }
    setLoading(false)
  }

  return (
    <main className="flex-auto mx-auto p-3 max-w-4xl w-full">
      <Title title={post?.name} />
      {post && (
        <FsLightbox
          toggler={lightboxOpen}
          sources={[`https://ik.imagekit.io/juandjara/${post.image}`]}
        />
      )}
      <div className="bg-white text-gray-700 pb-6 rounded-lg relative">
        <div className="z-20 w-full absolute top-0 left-0 p-2 flex items-start justify-between">
          <BackButton colors="bg-opacity-50 text-white bg-gray-500 hover:bg-opacity-75" />
          <Link href={`/post/edit/{id}`}>
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
          className="h-64 relative clip-vertical bg-gray-100 rounded-t-lg">
          {post?.image && (
            <Image
              className="rounded-t-lg"
              loader={imageKitLoader}
              src={'/' + post?.image}
              alt=""
              layout="fill"
              objectFit="cover"
            />
          )}
        </div>
        <header className="flex flex-wrap items-baseline px-4 mt-4">
          <h1 className="text-red-700 text-xl font-semibold mr-2 mb-1">
            {post?.name || <Skeleton />}
          </h1>
          <p className="text-base text-gray-500">{post?.game?.name || <Skeleton />}</p>
        </header>
        <div className="mt-4 mb-6 px-4">
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
            action={
              <ActionButton
                loading={loading}
                post={post}
                onAdd={handleAddPlayer}
                onDelete={handleRemovePlayer}
              />
            }
          />
        </div>
        <div className="px-4 mt-6">
          <PostDetailTags post={post} />
          <div className="mb-4 flex items-center space-x-2 p-2 bg-gray-50 rounded-md">
            <Avatar user={post?.narrator} size={32} />
            <span className="text-sm">{post?.narrator?.display_name}</span>
          </div>
        </div>
        <div
          className="hyphens text-justify font-serif leading-relaxed px-6 mt-8 mb-4 mx-auto max-w-prose"
          dangerouslySetInnerHTML={{ __html: post?.description }}></div>
        <div>
          <p className="mt-8 px-6 text-sm text-gray-400">
            Actualizado el {updateDate} a las {updateTime}
          </p>
        </div>
      </div>
    </main>
  )
}
