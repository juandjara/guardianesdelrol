import Link from 'next/link'
import Avatar from '@/components/Avatar'

export default function PostListItem({ post }) {
  const numplayers = post.players?.length || 0
  return (
    <li key={post.id} className="flex items-center relative">
      <div className="group">
        <Link href={`/users/${post.narrator.id}`}>
          <a>
            <Avatar border="border-gray-200" user={post.narrator} size={32} />
          </a>
        </Link>
        <div className="px-1 transition-opacity duration-300 opacity-0 group-hover:opacity-100 h-0 group-hover:h-auto overflow-hidden absolute left-9 top-2">
          <div className="px-2 py-1 bg-white rounded-md mb-2 w-full shadow-md">
            <p className="font-medium text-xs text-gray-500">{post.narrator.name}</p>
          </div>
        </div>
      </div>
      <div className="ml-2">
        <Link href={`/posts/${post.id}/${post.slug}`}>
          <a className="text-sm text-gray-700">{post.name}</a>
        </Link>
        <p className="text-sm text-gray-400">{numplayers} jugadores</p>
      </div>
    </li>
  )
}
