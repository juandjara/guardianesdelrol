import Skeleton from 'react-loading-skeleton'
import ClockIcon from './icons/ClockIcon'
import GlobeIcon from './icons/GlobeIcon'
import PlaceIcon from './icons/PlaceIcon'
import Tag from './Tag'

export default function PostDetailTags({ post }) {
  if (!post) {
    return <Skeleton />
  }

  const blueTags = post.tags.map(tag => (
    <Tag key={tag} color="indigo">
      {tag}
    </Tag>
  ))
  const redTags = [post.type, post.section?.name].filter(Boolean).map(tag => (
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
