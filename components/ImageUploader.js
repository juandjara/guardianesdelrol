import { useState } from 'react'
import Image from 'next/image'
import Button from './Button'
import CloseIcon from './icons/CloseIcon'
import FilterIcon from './icons/FilterIcon'
import FsLightbox from 'fslightbox-react'

function formatSize(n) {
  if (n < 1024) {
    return `${n} B`
  }
  if (n < 1024 * 1024) {
    return `${(n / 1024).toFixed(2)} KB`
  }
  return `${(n / 1024 / 1024).toFixed(2)} MB`
}

function ImageEditor({ url, file, onRemove = () => {} }) {
  const [lightboxOpen, setLightboxOpen] = useState(false)

  if (!file) {
    return null
  }

  return (
    <div className="group">
      <FsLightbox toggler={lightboxOpen} sources={[url]} />
      <Image className="z-10 rounded-md" alt="" src={url} layout="fill" objectFit="cover" />
      <div className="group-hover:opacity-100 opacity-0 transition-opacity duration-300 rounded-md flex flex-col z-20 absolute inset-0 bg-gradient-to-b from-transparent to-red-900">
        <div className="flex-grow flex items-center justify-center space-x-6">
          <Button
            aria-label="Ampliar"
            title="Ampliar"
            type="button"
            onClick={() => setLightboxOpen(!lightboxOpen)}
            hasIcon="only"
            border="border-2 border-red-100 hover:border-red-200"
            className="rounded-full shadow-lg">
            <svg
              height={20}
              width={20}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
              />
            </svg>
          </Button>
          <Button
            aria-label="Editar"
            title="Editar"
            type="button"
            hasIcon="only"
            border="border-2 border-red-100 hover:border-red-200"
            className="rounded-full shadow-lg">
            <FilterIcon width={20} height={20} />
          </Button>
          <Button
            aria-label="Descartar"
            title="Descartar"
            type="button"
            onClick={onRemove}
            hasIcon="only"
            border="border-2 border-red-100 hover:border-red-200"
            className="rounded-full shadow-lg">
            <CloseIcon width={20} height={20} />
          </Button>
        </div>
        <div className="p-3 absolute bottom-0 left-0">
          <p className="text-white font-medium text-sm">{file.name}</p>
          <p className="text-gray-300 text-xs">
            {formatSize(file.size)} · {file.type}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function ImageUploader() {
  const [imageURL, setImageURL] = useState(null)
  const [file, setFile] = useState(null)

  function handleFile(ev) {
    const reader = new FileReader()
    const file = ev.target.files[0]
    setFile({
      name: file.name,
      size: file.size,
      type: file.type
    })
    reader.onload = function handleImgLoad(ev) {
      const url = ev.target.result
      setImageURL(url)
    }
    reader.readAsDataURL(file)
  }

  function handleRemove() {
    setImageURL(null)
  }

  return (
    <div className="mt-1 relative">
      {imageURL ? <ImageEditor url={imageURL} file={file} onRemove={handleRemove} /> : null}
      <div className="px-6 pt-10 pb-8 space-y-1 flex flex-col items-center border-2 border-gray-300 border-dashed rounded-md">
        <svg
          className="h-12 w-12 text-gray-400"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 48 48"
          aria-hidden="true">
          <path
            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div className="flex text-sm text-gray-600">
          <label
            htmlFor="file-upload"
            className="relative cursor-pointer bg-white rounded-md font-medium text-red-600 hover:text-red-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-red-400">
            <span>Upload a file</span>
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleFile}
            />
          </label>
          <p className="pl-1">or drag and drop</p>
        </div>
        <p className="text-xs text-gray-500 pb-1">PNG, JPG, GIF up to 10MB</p>
        <Button type="button" small>
          <p className="m-0 text-xs">Select from posts gallery</p>
        </Button>
      </div>
    </div>
  )
}
