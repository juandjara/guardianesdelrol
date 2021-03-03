import Link from 'next/link'
import { useRef } from 'react'
import Skeleton from 'react-loading-skeleton'
import ImageKit from '../ImageKit'

export default function GameCard({ game }) {
  const linkRef = useRef()

  function triggerLink(ev) {
    const link = linkRef.current
    if (link && link !== ev.target) link.click()
  }

  const position = game?.image_position || game?.image_position === 0 ? game?.image_position : 50

  return (
    <li
      role="presentation"
      onClick={triggerLink}
      className="cursor-pointer flex flex-col md:flex-row bg-white text-gray-700 rounded-lg ring-red-500 hover:ring-4 focus-within:ring-4 transition-shadow duration-500">
      <div className="bg-gray-100 md:h-44 md:aspect-none aspect-w-7 aspect-h-3 md:w-80 w-full md:flex-shrink-0 clip-horizontal rounded-t-lg md:rounded-t-none md:rounded-l-lg">
        {game ? (
          game.image && (
            <ImageKit
              style={{
                objectPosition: `0 ${position}%`,
                width: '100%',
                height: '100%'
              }}
              className="object-cover rounded-t-lg md:rounded-t-none md:rounded-l-lg"
              src={game.image}
              alt=""
            />
          )
        ) : (
          <Skeleton height={43 * 4} />
        )}
      </div>
      <div className="max-w-prose p-3 flex flex-col flex-grow justify-center">
        <h2 className="text-lg font-bold truncate text-red-700">
          {game ? (
            <Link href={`/catalog/${game.id}/${game.slug}`}>
              <a ref={linkRef} className="text-red-700 hover:no-underline">
                {game.name}
              </a>
            </Link>
          ) : (
            <Skeleton />
          )}
        </h2>
        <div className="space-y-1">
          {game ? (
            <p className="text-sm text-gray-400 mb-1">
              <span className="text-xl text-gray-700 font-medium mr-1">{game.posts.length}</span>
              partida{game.posts.length === 1 ? '' : 's'}
            </p>
          ) : (
            <Skeleton className="text-xl" />
          )}
          {game ? (
            game.posts.slice(0, 3).map(post => (
              <p key={post.id} className="text-xs text-gray-700">
                {post.name}
              </p>
            ))
          ) : (
            <Skeleton count={3} />
          )}
          {game && game.posts.length > 3 && (
            <p className="text-xs text-gray-400">y {game.posts.length - 3} más...</p>
          )}
        </div>
      </div>
    </li>
  )
}
