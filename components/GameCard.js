import imageKitLoader from '@/lib/imageKitLoader'
import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'

export default function GameCard({ game }) {
  const linkRef = useRef()
  const image = game.posts.find(p => p.image)?.image

  function triggerLink(ev) {
    const link = linkRef.current
    if (link && link !== ev.target) link.click()
  }

  return (
    <li
      role="presentation"
      onClick={triggerLink}
      className="flex flex-col md:flex-row bg-white text-gray-700 rounded-lg ring-red-500 hover:ring-4 focus-within:ring-4 transition-shadow duration-500">
      <div className="h-44 md:w-80 md:flex-shrink-0 relative clip-horizontal">
        {image && (
          <Image
            className="rounded-t-lg md:rounded-t-none md:rounded-l-lg"
            loader={imageKitLoader}
            src={'/' + image}
            alt=""
            layout="fill"
            objectFit="cover"
          />
        )}
      </div>
      <div className="max-w-prose p-3 flex flex-col flex-grow justify-center">
        <h2 className="text-lg font-bold truncate text-red-700">
          <Link href={`/catalog/${game.id}/${game.slug}`}>
            <a ref={linkRef} className="text-red-700 hover:no-underline">
              {game.name}
            </a>
          </Link>
        </h2>
        <div className="space-y-1">
          <p className="text-sm text-gray-400 mb-1">
            <span className="text-xl text-gray-700 font-medium mr-1">{game.posts.length}</span>
            partida{game.posts.length === 1 ? '' : 's'}
          </p>
          {game.posts.slice(0, 3).map(post => (
            <p key={post.id} className="text-xs text-gray-700">
              {post.name}
            </p>
          ))}
          {game.posts.length > 3 && (
            <p className="text-xs text-gray-400">y {game.posts.length - 3} más...</p>
          )}
        </div>
      </div>
    </li>
  )
}
