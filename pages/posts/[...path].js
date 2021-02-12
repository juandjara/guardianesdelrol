import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Button from '@/components/Button'
import BackIcon from '@/components/icons/BackIcon'
import usePostDetail from '@/lib/data/usePostDetail'
import imageKitLoader from '@/lib/imageKitLoader'
import Image from 'next/image'
// import useAuthGuard from '@/lib/useAuthGuard'
import Link from 'next/link'
import Skeleton from 'react-loading-skeleton'
import Tag from '@/components/Tag'
import Avatar from '@/components/Avatar'
import AvatarList from '@/components/AvatarList'
import ClockIcon from '@/components/icons/ClockIcon'
import { useSession } from '@/lib/auth/UserContext'
import PlaceIcon from '@/components/icons/PlaceIcon'
import GlobeIcon from '@/components/icons/GlobeIcon'
import FsLightbox from 'fslightbox-react'

function TagsLine({ post }) {
  if (!post) {
    return <Skeleton />
  }

  const blueTags = post.tags.map(tag => (
    <Tag key={tag} color="indigo">
      {tag}
    </Tag>
  ))
  const redTags = [post.type, post.section?.name, ...post.tags].filter(Boolean).map(tag => (
    <Tag key={tag} color="red">
      {tag}
    </Tag>
  ))

  const date = new Date(post.date).toLocaleDateString('es', { dateStyle: 'medium' })
  const datetime = `${date} ${post.time || ''}`
  const LinkIcon = post.type === 'online' ? GlobeIcon : PlaceIcon

  return (
    <div className="flex flex-wrap items-center font-semibold space-x-2 mr-1 mb-1 -ml-2 md:-ml-0">
      <span className="my-1 ml-2 md:ml-0 mr-1 w-full md:w-auto flex items-center text-sm text-gray-500 font-medium">
        <ClockIcon className="mr-1 text-gray-400" width={16} height={16} />
        {datetime}
      </span>
      {blueTags}
      {redTags}
      <span className="flex-grow-0 md:flex-grow"></span>
      <a
        href="https://maps.google.com/"
        target="_blank"
        title="ver mapa"
        rel="noopener noreferrer"
        className="my-1 flex items-center text-sm text-gray-500 font-normal">
        <LinkIcon className="mr-1 text-gray-400" height={16} width={16} />
        <span>{post.place}</span>
      </a>
    </div>
  )
}

function ActionButton({ post, onAdd, onDelete }) {
  const session = useSession()
  const currentId = session?.user?.id

  if (!post) {
    return null
  }

  const isPlaying = post.players.some(p => p.id === currentId)
  const isFull = post.players.length === post.seats

  if (isPlaying) {
    return (
      <Button
        onClick={onAdd}
        hasIcon="left"
        className="mb-2 ml-2"
        color="text-red-700"
        border="border"
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
          onClick={onDelete}
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

  const [lightboxOpen, setLightboxOpen] = useState(false)

  useEffect(() => {
    if (post && post.slug && post.slug !== slug) {
      router.replace(`/post/${post.id}/${post.slug}`)
    }
  }, [router, slug, post])

  return (
    <main className="flex-auto mx-auto p-3 max-w-4xl w-full">
      {post && (
        <FsLightbox
          toggler={lightboxOpen}
          sources={[`https://ik.imagekit.io/juandjara/${post.image}`]}
        />
      )}
      <div className="bg-white text-gray-700 pb-6 rounded-lg relative">
        <div className="z-20 w-full absolute top-0 left-0 p-2 flex items-start justify-between">
          <button
            title="Volver"
            aria-label="Volver"
            onClick={() => router.back()}
            className="rounded-full p-2 bg-opacity-50 text-white bg-gray-500 hover:bg-opacity-75 focus:outline-none focus:ring focus:ring-offset-0 focus:ring-blue-500 focus:ring-offset-transparent">
            <BackIcon height={20} width={20} />
          </button>
          <Link href={`/edit/post/{id}`}>
            <a>
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
            {post ? (
              <>
                <span className="text-xl text-gray-600 font-medium mr-2">
                  {numplayers} / {post?.seats}
                </span>
                jugador{post?.seats === 1 ? '' : 'es'}
              </>
            ) : (
              <Skeleton />
            )}
          </p>
          <AvatarList users={post?.players} action={<ActionButton post={post} />} />
        </div>
        <div className="px-4 mt-6">
          <TagsLine post={post} />
          <div className="mb-4 flex items-center space-x-2 p-2 bg-gray-50 rounded-md">
            <Avatar user={post?.narrator} size={32} />
            <span className="text-sm">{post?.narrator?.display_name}</span>
          </div>
        </div>
        <div
          className="hyphens text-justify font-serif leading-relaxed px-6 mt-8 mb-4 mx-auto max-w-prose"
          dangerouslySetInnerHTML={{ __html: post?.description }}></div>
      </div>
    </main>
  )
}
