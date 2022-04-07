import useAuthGuard from '@/lib/auth/useAuthGuard'
import { useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import Link from 'next/link'
import Button from '@/components/Button'
import FsLightbox from 'fslightbox-react'
import BackButton from '@/components/BackButton'
import Title from '@/components/Title'
import ImageKit from '@/components/ImageKit'
import PostListItem from '@/components/posts/PostListItem'
import useSections from '@/lib/useSections'
import { useQueryParams } from '@/lib/useQueryParams'
import AddIcon from '@/components/icons/AddIcon'

export default function SectionDetail() {
  useAuthGuard()
  const { params } = useQueryParams()
  const id = Number(params.id)
  const { sections } = useSections()
  const section = sections.find(s => s.id === id)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const numposts = section?.posts.length || 0
  const updateTime = section?.updated_at && new Date(section?.updated_at).toLocaleTimeString()
  const updateDate = section?.updated_at && new Date(section?.updated_at).toLocaleDateString()
  const position =
    section?.image_position || section?.image_position === 0 ? section?.image_position : 50

  return (
    <main className="flex-auto mx-auto py-3 max-w-3xl w-full">
      <Title title={section?.name} />
      {section?.image && (
        <FsLightbox
          toggler={lightboxOpen}
          sources={[`${process.env.NEXT_PUBLIC_IMAGEKIT_URL}/${section.image}`]}
        />
      )}
      <div className="bg-white text-gray-700 pb-6 md:rounded-lg relative">
        <div className="z-10 w-full absolute top-0 left-0 p-2 flex items-start justify-between">
          <BackButton colors="bg-opacity-50 text-white bg-gray-500 hover:bg-opacity-75" />
          <Link href={`/sections/edit/${id}`}>
            <a className="hover:no-underline">
              <Button small>Editar</Button>
            </a>
          </Link>
        </div>
        <div
          role="button"
          tabIndex="0"
          aria-label="Ver imagen completa"
          title="Ver imagen completa"
          onKeyUp={ev => ev.key === 'Enter' && setLightboxOpen(!lightboxOpen)}
          onClick={() => setLightboxOpen(!lightboxOpen)}
          className="aspect-w-7 aspect-h-3 relative clip-vertical bg-gray-100 md:rounded-t-lg">
          {section?.image && (
            <ImageKit
              alt=""
              src={section.image}
              style={{ objectPosition: `0 ${position}%` }}
              className="w-full h-full object-cover md:rounded-t-lg"
            />
          )}
        </div>
        <header className="px-4 my-4">
          <h1 className="text-red-700 text-xl font-semibold">{section?.name || <Skeleton />}</h1>
          <div
            className="text-base mt-2 ql-editor p-0"
            dangerouslySetInnerHTML={{ __html: section?.description }}></div>
        </header>
        <Link href={`/posts/edit/new?initialSection=${section?.id}`}>
          <a className="mx-4 hover:no-underline">
            <Button
              small
              hasIcon="left"
              className="my-1"
              background="bg-red-500 hover:bg-red-400 hover:bg-opacity-100"
              color="text-white"
              border="border-none">
              <AddIcon className="-ml-1" width={20} height={20} />
              <span>Crear partida</span>
            </Button>
          </a>
        </Link>
        <div className="space-y-6 p-4 pb-0">
          <div>
            <p className="text-base text-gray-400 mb-4 mr-2">
              <span className="text-2xl text-gray-700 font-medium mr-1">{numposts}</span>
              partida{numposts === 1 ? '' : 's'}
            </p>
            {section && (
              <ul className="space-y-4">
                {section?.posts.map(post => (
                  <PostListItem key={post.id} post={post} />
                ))}
              </ul>
            )}
          </div>
          {section?.updated_at && (
            <div>
              <p className="mt-8 text-sm text-gray-400">
                Actualizado el {updateDate} a las {updateTime}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
