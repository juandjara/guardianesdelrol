import Link from 'next/link'
import Skeleton from 'react-loading-skeleton'
import CalendarIcon from '../icons/CalendarIcon'
import PlaceIcon from '../icons/PlaceIcon'
import Tag from '../Tag'

function PlaceLink({ post }) {
  if (!post.place) {
    return null
  }

  const className = 'my-1 flex items-center text-sm font-normal'
  return post.place_link ? (
    <a
      href={post.place_link}
      target="_blank"
      title="abrir enlace del lugar"
      rel="noopener noreferrer"
      className={`text-blue-500 ${className}`}>
      <PlaceIcon className="mr-1 text-blue-400" height={16} width={16} />
      <span>{post.place}</span>
    </a>
  ) : (
    <p className={`text-gray-500 ${className}`}>
      <PlaceIcon className="mr-1 text-gray-400" height={16} width={16} />
      <span>{post.place}</span>
    </p>
  )
}

export function formatDateTime({ date, time, label }) {
  const dateStr = new Date(date).toLocaleDateString('es', { dateStyle: 'medium' })
  const dateTime = `${dateStr} ${time || ''}`
  return label ? `${dateTime} - ${label}` : dateTime
}

export default function PostDetailTagLine({ post }) {
  if (!post) {
    return <Skeleton />
  }

  const blueTags = post.tags.map(tag => (
    <Tag key={tag} color="indigo">
      {tag}
    </Tag>
  ))
  const redTag = post.section?.id ? (
    <Tag color="red">
      <Link href={`/posts?s=${post.section.id}`}>
        {post.section.name || `Evento ID${post.section?.id}`}
      </Link>
    </Tag>
  ) : null

  const dateTime = post.dates_with_labels.length
    ? post.dates_with_labels
    : [{ date: post.date, time: post.time }]

  return (
    <div className="flex flex-wrap items-center font-semibold space-x-2 mr-1 mb-1 -ml-2 md:-ml-0">
      {dateTime.map((d, i) => (
        <span
          key={i}
          className="my-1 ml-2 md:ml-0 mr-1 w-full md:w-auto flex items-center text-sm text-gray-500 font-medium">
          <CalendarIcon className="mr-1 text-gray-400" width={16} height={16} />
          {formatDateTime(d)}
        </span>
      ))}
      {blueTags}
      {redTag}
      <span className="hidden md:inline md:flex-grow"></span>
      <PlaceLink post={post} />
    </div>
  )
}
