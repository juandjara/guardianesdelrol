import { useRef, useState } from 'react'
import Image from 'next/image'
import Button from './Button'
import CloseIcon from './icons/CloseIcon'
import FilterIcon from './icons/FilterIcon'
import FsLightbox from 'fslightbox-react'
import Dialog from '@reach/dialog'

function formatSize(n) {
  if (n < 1024) {
    return `${n} B`
  }
  if (n < 1024 * 1024) {
    return `${(n / 1024).toFixed(2)} KB`
  }
  return `${(n / 1024 / 1024).toFixed(2)} MB`
}

const POSITION_OPTIONS = [
  { value: 'top', label: 'Arriba' },
  { value: 'bottom', label: 'Abajo' },
  { value: 'center', label: 'Centro' },
  { value: 'custom', label: 'Otro:' }
]

function getLinePosition(opt, custom, rectHeight) {
  const top = `${rectHeight / 2}px`
  if (opt === 'top') return top

  const bottom = `calc(100% - ${rectHeight / 2}px)`
  if (opt === 'bottom') return bottom
  if (opt === 'center') return '50%'
  if (opt === 'custom') return `clamp(${top}, ${custom}%, ${bottom})`
}

function getRectHeight(node) {
  if (!node) return 0
  return node.getBoundingClientRect().height
}

function ImageDialog({ url, open, setOpen, position, onConfirm }) {
  const inputRef = useRef(null)
  const rectangleRef = useRef(null)
  const [positionOption, setPositionOption] = useState('center')
  const [customPosition, setCustomPosition] = useState(position)
  const rectHeight = getRectHeight(rectangleRef.current)
  const linePosition = getLinePosition(positionOption, customPosition, rectHeight)

  function close() {
    setOpen(false)
  }

  function handleSubmit(ev) {
    ev.preventDefault()
  }

  function handlePositionOption(opt) {
    setPositionOption(opt)
    if (opt === 'top') {
      setCustomPosition(0)
    }
    if (opt === 'center') {
      setCustomPosition(50)
    }
    if (opt === 'bottom') {
      setCustomPosition(100)
    }
  }

  function confirm() {
    close()
    onConfirm(customPosition)
  }

  return (
    <Dialog
      initialFocusRef={inputRef}
      className="rounded-md px-4 py-3 mx-3 md:mx-auto my-6 max-w-xl w-auto flex flex-col"
      isOpen={open}
      onDismiss={close}>
      <header className="mb-2 flex justify-between items-baseline">
        <p className="text-lg text-gray-700 font-medium">Editar imagen</p>
        <Button small border="border-none" onClick={close} type="button" hasIcon="only">
          <CloseIcon width={20} height={20} />
        </Button>
      </header>
      <div className="relative bg-gray-100 overflow-hidden">
        <div
          ref={rectangleRef}
          style={{ top: linePosition }}
          className="transform -translate-y-1/2 absolute w-full left-0 border border-red-900 bg-white bg-opacity-30">
          <div className="w-full aspect-w-7 aspect-h-3"></div>
        </div>
        <img className="object-contain w-full h-full" alt="" src={url} />
      </div>
      <form className="mt-6 mb-3" onSubmit={handleSubmit}>
        <p className="text-sm text-gray-700 font-medium">Linea de recorte</p>
        <div className="md:flex flex-wrap items-center md:space-x-6">
          {POSITION_OPTIONS.map((opt, i) => (
            <label key={opt.value} className="my-4 md:my-2 flex items-center">
              <input
                ref={i === 0 ? inputRef : null}
                type="radio"
                name="position_option"
                value={opt.value}
                checked={positionOption === opt.value}
                onChange={ev => handlePositionOption(ev.target.value)}
                className="h-5 w-5 text-red-500"
              />
              <span className="ml-2 text-gray-700">{opt.label}</span>
            </label>
          ))}
          {positionOption === 'custom' && (
            <div className="space-x-2 my-2">
              <input
                className="inline w-24 rounded-md"
                name="custom_pos"
                type="number"
                min="0"
                max="100"
                value={customPosition}
                onChange={ev => setCustomPosition(ev.target.value)}
              />
              <span>%</span>
            </div>
          )}
        </div>
        <div className="flex justify-end mt-8 space-x-2">
          <Button onClick={close} type="button" background="" border="border-none">
            Cancelar
          </Button>
          <Button
            onClick={confirm}
            type="button"
            background="bg-red-500 hover:bg-red-600"
            color="text-white"
            border="border-none">
            Confirmar
          </Button>
        </div>
      </form>
    </Dialog>
  )
}

function ImageEditor({ url, file, onRemove = () => {} }) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [position, setPosition] = useState(50)

  if (!file) {
    return null
  }

  return (
    <div className="group aspect-w-7 aspect-h-3">
      <ImageDialog
        url={url}
        open={dialogOpen}
        setOpen={setDialogOpen}
        position={position}
        onConfirm={setPosition}
      />
      <FsLightbox toggler={lightboxOpen} sources={[url]} />
      <Image
        className="z-10 rounded-md"
        alt=""
        src={url}
        layout="fill"
        objectFit="cover"
        objectPosition={`0 ${position}%`}
      />
      <div className="rounded-md flex flex-col z-20 absolute inset-0 bg-gradient-to-b from-transparent to-red-900">
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
            onClick={() => setDialogOpen(true)}
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
        <p className="p-3 absolute bottom-0 left-0">
          <span className="text-base text-white font-medium">{file.name} </span>
          <span className="text-sm text-gray-300"> · {formatSize(file.size)}</span>
        </p>
      </div>
    </div>
  )
}

export default function ImageUploader() {
  const [imageURL, setImageURL] = useState(null)
  const [file, setFile] = useState(null)
  const [isDragging, setIsDragging] = useState(false)

  function handleFile(file) {
    const reader = new FileReader()
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

  function handleDrop(ev) {
    setIsDragging(false)
    ev.preventDefault()
    const file = ev.dataTransfer.files[0]
    if (file.type.split('/')[0] === 'image') {
      handleFile(file)
    }
  }

  function handleDrag(ev, isDragging) {
    ev.preventDefault()
    setIsDragging(isDragging)
  }

  const dropzoneStyle = `${
    isDragging ? 'bg-red-50' : ''
  } px-6 pt-10 pb-8 space-y-1 flex flex-col justify-center items-center border-2 border-gray-300 border-dashed rounded-md`

  if (imageURL) {
    return <ImageEditor url={imageURL} file={file} onRemove={handleRemove} />
  }

  return (
    <div className="mt-1 aspect-w-7 aspect-h-3">
      <div
        onDrop={handleDrop}
        onDragOver={ev => handleDrag(ev, true)}
        onDragLeave={ev => handleDrag(ev, false)}
        className={dropzoneStyle}>
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
            className="relative cursor-pointer rounded-md font-medium text-red-600 hover:text-red-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-red-400">
            <span>Upload a file</span>
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={ev => handleFile(ev.target.files[0])}
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
