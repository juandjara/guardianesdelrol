import imageKitLoader from '@/lib/imageKitLoader'
import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'
import Avatar from './Avatar'
import CalendarIcon from './icons/CalendarIcon'
import PlaceIcon from './icons/PlaceIcon'
import UserGroupIcon from './icons/UserGroupIcon'
import Tag from './Tag'

export default function PostCard({ post }) {
  const linkRef = useRef()
  const tags = [post.section?.name, post.type, ...post.tags].filter(Boolean).map(tag => (
    <Tag key={tag} color="red">
      {tag}
    </Tag>
  ))

  function triggerLink(ev) {
    const link = linkRef.current
    if (link && link !== ev.target) link.click()
  }

  return (
    <li
      role="presentation"
      onClick={triggerLink}
      className="flex flex-col bg-white text-gray-700 rounded-lg ring-red-500 hover:ring-4 focus-within:ring-4 transition-shadow duration-500">
      <div className="h-44 relative clip-vertical">
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
      <div className="py-2 px-3 flex flex-col flex-grow">
        <header>
          <h2 className="text-lg font-bold text-red-700">
            <Link href={`/posts/${post.id}/${post.slug}`}>
              <a ref={linkRef} className="text-red-700 hover:no-underline">
                {post.name}
              </a>
            </Link>
          </h2>
          <p className="text-base text-gray-500 mb-1">{post.game?.name}</p>
        </header>
        <div className="space-x-2 flex flex-wrap items-stretch font-semibold mb-6">{tags}</div>
        <div className="flex items-start space-x-2 mt-auto">
          <Avatar user={post.narrator} size={42} />
          <div className="flex-grow pr-1">
            <p className="text-base mb-1">{post.narrator?.display_name}</p>
            <p className="text-sm text-gray-400">
              <span className="flex items-center space-x-2 mb-1">
                <UserGroupIcon height={20} width={20} />
                <span>
                  <span className="font-medium text-gray-500">
                    {post.players.length} / {post.seats}
                  </span>
                  <span> jugadores</span>
                </span>
              </span>
              <span className="flex items-center space-x-2 mb-1">
                <CalendarIcon height={20} width={20} />
                <span>
                  {new Date(post.date).toLocaleDateString('es', { dateStyle: 'medium' })}{' '}
                  {post.time}
                </span>
              </span>
              {post.place && (
                <span className="flex items-center space-x-2 mb-1">
                  <PlaceIcon height={20} width={20} />
                  <span>{post.place}</span>
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    </li>
  )
}
