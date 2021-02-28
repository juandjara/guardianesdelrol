import Link from 'next/link'
import { useRef } from 'react'
import Skeleton from 'react-loading-skeleton'
import Avatar from '../Avatar'
import CalendarIcon from '../icons/CalendarIcon'
import PlaceIcon from '../icons/PlaceIcon'
import UserGroupIcon from '../icons/UserGroupIcon'
import ImageKit from '../ImageKit'
import Tag from '../Tag'

function Tags({ post }) {
  const blueTags = (post?.tags || []).map(tag => (
    <Tag key={tag} color="indigo">
      {tag}
    </Tag>
  ))
  const redTags = [post?.type, post?.section?.name].filter(Boolean).map(tag => (
    <Tag key={tag} color="red">
      {tag}
    </Tag>
  ))

  return (
    <div className="space-x-2 flex flex-wrap items-stretch font-semibold mb-6">
      {blueTags}
      {redTags}
    </div>
  )
}

export default function PostCard({ post }) {
  const linkRef = useRef()

  function triggerLink(ev) {
    const link = linkRef.current
    if (link && link !== ev.target) link.click()
  }

  return (
    <li
      role="presentation"
      onClick={triggerLink}
      className="cursor-pointer flex flex-col bg-white text-gray-700 rounded-lg ring-red-500 hover:ring-4 focus-within:ring-4 transition-shadow duration-500">
      <div className="h-44 bg-gray-100 w-full clip-vertical rounded-t-lg">
        {post ? (
          post.image && (
            <ImageKit alt="" src={post.image} className="w-full h-full rounded-t-lg object-cover" />
          )
        ) : (
          <Skeleton height={44 * 4} />
        )}
      </div>
      <div className="py-2 px-3 flex flex-col flex-grow">
        <header>
          <h2 className="text-lg font-bold">
            {post ? (
              <Link href={`/posts/${post.id}/${post.slug}`}>
                <a ref={linkRef} className="text-red-700 hover:no-underline">
                  {post.name}
                </a>
              </Link>
            ) : (
              <Skeleton />
            )}
          </h2>
          <p className="text-base text-gray-500 mb-1">{post ? post.game?.name : <Skeleton />}</p>
        </header>
        <Tags post={post} />
        <div className="flex items-start space-x-2 mt-auto">
          <Avatar user={post?.narrator} size={42} />
          {post ? (
            <div className="flex-grow pr-1">
              <p className="text-base mb-1">{post.narrator?.display_name}</p>
              <p className="text-sm text-gray-400">
                <span className="flex items-start space-x-2 mb-1">
                  <UserGroupIcon className="flex-shrink-0" height={20} width={20} />
                  <span>
                    <span className="font-medium text-gray-500">
                      {post.players.length} / {post.seats}
                    </span>
                    <span> jugadores</span>
                  </span>
                </span>
                <span className="flex items-start space-x-2 mb-1">
                  <CalendarIcon className="flex-shrink-0" height={20} width={20} />
                  <span>
                    {new Date(post.date).toLocaleDateString('es', { dateStyle: 'medium' })}{' '}
                    {post.time}
                  </span>
                </span>
                {post.place && (
                  <span className="flex items-start space-x-2 mb-1">
                    <PlaceIcon className="flex-shrink-0" height={20} width={20} />
                    <span>{post.place}</span>
                  </span>
                )}
              </p>
            </div>
          ) : (
            <div className="w-full">
              <Skeleton count={4} />
            </div>
          )}
        </div>
      </div>
    </li>
  )
}
