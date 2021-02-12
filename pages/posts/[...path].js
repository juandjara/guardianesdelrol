import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Button from '@/components/Button'
import BackIcon from '@/components/icons/BackIcon'
import usePostDetail from '@/lib/data/usePostDetail'
import imageKitLoader from '@/lib/imageKitLoader'
import Image from 'next/image'
// import useAuthGuard from '@/lib/useAuthGuard'
import Link from 'next/link'
import Skeleton from 'react-loading-skeleton'
import Tag from '@/components/Tag'
// import ClockIcon from '@/components/icons/ClockIcon'
import Avatar from '@/components/Avatar'
import AvatarList from '@/components/AvatarList'

function Tags({ post }) {
  if (!post) {
    return <Skeleton />
  }

  const tags = [post.section?.name, post.type, ...post.tags].filter(Boolean).map(tag => (
    <Tag key={tag} color="red">
      {tag}
    </Tag>
  ))
  const date = new Date(post.date).toLocaleDateString('es', { dateStyle: 'medium' })
  const datetime = `${date} ${post.time || ''}`

  return (
    <div className="space-x-2 flex flex-wrap items-center font-semibold mb-2">
      <span className="text-sm text-gray-600 font-medium">{datetime}</span>
      {tags}
    </div>
  )
}

export default function PostDetails() {
  const router = useRouter()
  const [id, slug] = router.query.path || []
  const { data: post } = usePostDetail(id)
  const numplayers = post?.players?.length || 0

  useEffect(() => {
    if (post && post.slug && post.slug !== slug) {
      router.replace(`/post/${post.id}/${post.slug}`)
    }
  }, [router, slug, post])

  const actionButton = (
    <Button className="mx-0 my-0 mb-2 ml-2 md:text-sm md:border md:font-normal" small>
      Abandonar
    </Button>
  )

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
          <Link href={`/edit/post/{id}`}>
            <a>
              <Button className="mx-0 my-0" small>
                Editar
              </Button>
            </a>
          </Link>
        </div>
        <div className="h-64 relative clip-vertical bg-gray-100 rounded-t-lg">
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
        <div className="text-gray-600 my-4 px-4">
          <p className="text-base text-gray-400 mb-4">
            {post ? (
              <span>
                <span className="text-xl text-gray-700 font-medium mr-2">
                  {numplayers} / {post?.seats}
                </span>
                jugador{post?.seats === 1 ? '' : 'es'}
              </span>
            ) : (
              <Skeleton />
            )}
          </p>
          <AvatarList users={post?.players} action={actionButton} />
        </div>
        <div className="px-4 mt-6">
          <div className="mb-4 flex items-center space-x-2 p-2 bg-gray-50 rounded-md">
            <Avatar user={post?.narrator} size={32} />
            <span className="text-sm">{post?.narrator?.display_name}</span>
          </div>
          <Tags post={post} />
        </div>
        <div className="px-4 my-4" dangerouslySetInnerHTML={{ __html: post?.description }}></div>
      </div>
    </main>
  )
}
