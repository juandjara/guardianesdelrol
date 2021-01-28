import imageKitLoader from '@/lib/imageKitLoader'
import Image from 'next/image'
import Avatar from './Avatar'
import ClockIcon from './icons/ClockIcon'
import UserIcon from './icons/UserIcon'
import Tag from './Tag'

export default function PostCard({ post }) {
  const tags = [post.type, post.section?.name, ...post.tags].filter(Boolean).map(tag => (
    <Tag key={tag} color="red">
      {tag}
    </Tag>
  ))

  return (
    <li className="flex h-96 flex-col bg-white text-gray-700 rounded-lg ring-red-500 hover:ring-4 focus-within:ring-4 transition-shadow duration-500">
      <div className="h-44 relative">
        {post.image && (
          <Image
            className="rounded-t-lg"
            loader={imageKitLoader}
            src={'/' + post.image}
            alt=""
            layout="fill"
            objectFit="cover"
          />
        )}
      </div>
      <div className="max-w-prose py-2 px-3 flex flex-col flex-grow">
        <div className="mb-1 space-x-2 flex flex-wrap items-stretch">{tags}</div>
        <h2 className="text-lg font-bold">
          <a className="text-red-700" href={`/posts/${post.id}/${post.slug}`}>
            {post.name}
          </a>
        </h2>
        <p className="text-base text-gray-500 mb-2">{post.game?.name}</p>
        <div className="mt-auto text-gray-600">
          <p className="flex items-center space-x-2 text-sm mb-2">
            <UserIcon width={20} height={20} />
            <span className="font-semibold">
              {post.players.length + post.guest_players.length} / {post.seats}{' '}
              <span className="font-normal">jugadores</span>
            </span>
          </p>
          <p className="flex items-center space-x-2 text-sm mb-2">
            <ClockIcon height={20} width={20} />
            <span>
              {new Date(post.date).toLocaleDateString('es', { dateStyle: 'medium' })} {post.time}
            </span>
          </p>
          <div className="flex items-center space-x-2">
            <Avatar user={post.narrator} size={32} />
            <span className="text-sm">{post.narrator?.display_name || post.guest_narrator}</span>
          </div>
        </div>
      </div>
    </li>
  )
}
