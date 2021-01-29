import imageKitLoader from '@/lib/imageKitLoader'
import Image from 'next/image'

export default function GameCard({ game }) {
  const image = game.posts.find(p => p.image)?.image
  return (
    <li className="flex flex-col md:flex-row bg-white text-gray-700 rounded-lg ring-red-500 hover:ring-4 focus-within:ring-4 transition-shadow duration-500">
      <div className="h-44 md:w-80 md:flex-shrink-0 relative">
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
      <div className="md:border-l border-gray-200 max-w-prose py-2 px-3 flex flex-col flex-grow justify-center">
        <h2 className="text-lg font-bold">
          <a className="text-red-700" href={`/catalog/${game.id}/${game.slug}`}>
            {game.name}
          </a>
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
