import { useRef, useState } from 'react'
import Button from './Button'
import CloseIcon from './icons/CloseIcon'
import FilterIcon from './icons/FilterIcon'
import FsLightbox from 'fslightbox-react'
import Dialog from '@reach/dialog'

const POSITION_OPTIONS = [
  { value: 'top', label: 'Por arriba' },
  { value: 'bottom', label: 'Por abajo' },
  { value: 'center', label: 'Centrado' }
]

function ImageDialog({ url, position, onClose, onConfirm }) {
  const inputRef = useRef(null)
  const [positionOption, setPositionOption] = useState(() => {
    if (position === 0) return 'top'
    if (position === 50) return 'center'
    if (position === 100) return 'bottom'
    return 'custom'
  })
  const [customPosition, setCustomPosition] = useState(position)

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
    onClose()
    onConfirm(customPosition)
  }

  return (
    <Dialog
      aria-labelledby="image-dialog-label"
      initialFocusRef={inputRef}
      className="rounded-md px-4 py-3 mx-auto max-w-3xl w-auto flex flex-col"
      isOpen={true}
      onDismiss={onClose}>
      <header className="mb-2 flex justify-between items-baseline">
        <p id="image-dialog-label" className="text-lg text-gray-700 font-medium">
          Editar imagen
        </p>
        <Button small border="border-none" onClick={onClose} type="button" hasIcon="only">
          <CloseIcon width={20} height={20} />
        </Button>
      </header>
      <div className="aspect-w-7 aspect-h-3">
        <img
          alt=""
          src={url}
          className="rounded-md object-cover w-full h-full"
          style={{ objectPosition: `0 ${customPosition}%` }}
        />
      </div>
      <div className="mt-6 mb-3">
        <p className="text-sm text-gray-700 font-medium">Recorte</p>
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
          <div className="flex items-center space-x-4 my-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="position_option"
                value="custom"
                checked={positionOption === 'custom'}
                onChange={ev => handlePositionOption(ev.target.value)}
                className="h-5 w-5 text-red-500"
              />
              <span className="ml-2 text-gray-700">Otro: </span>
            </label>
            {positionOption === 'custom' && (
              <div className="space-x-2">
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
        </div>
        <div className="flex justify-end mt-8 space-x-2">
          <Button onClick={onClose} type="button" background="" border="border-none">
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
      </div>
    </Dialog>
  )
}

function ImageEditor({ url, filename, position, setPosition, onRemove = () => {} }) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  if (!url) {
    return null
  }

  return (
    <div className="group aspect-w-7 aspect-h-3">
      {dialogOpen && (
        <ImageDialog
          url={url}
          position={position}
          onConfirm={setPosition}
          onClose={() => setDialogOpen(false)}
        />
      )}
      <FsLightbox toggler={lightboxOpen} sources={[url]} />
      <img
        alt=""
        src={url}
        className="z-10 rounded-md object-cover w-full h-full"
        style={{ objectPosition: `0 ${position}%` }}
      />
      <div className="rounded-md z-20 absolute inset-0">
        <div className="h-full flex items-center justify-center space-x-6">
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
        <p className="p-3 pt-12 absolute bottom-0 right-0 left-0 text-white font-medium bg-gradient-to-b from-transparent to-red-900">
          {filename}
        </p>
      </div>
    </div>
  )
}

function ImageUploader({ onFileChange }) {
  const [isDragging, setIsDragging] = useState(false)

  function handleDrop(ev) {
    setIsDragging(false)
    ev.preventDefault()
    const file = ev.dataTransfer.files[0]
    if (file.type.split('/')[0] === 'image') {
      onFileChange(file)
    }
  }

  function handleDrag(ev, isDragging) {
    ev.preventDefault()
    setIsDragging(isDragging)
  }

  const dropzoneStyle = `${
    isDragging ? 'bg-red-50' : ''
  } space-y-1 flex flex-col justify-center items-center border-2 border-gray-300 border-dashed rounded-md`

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
              onChange={ev => onFileChange(ev.target.files[0])}
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

export default function ImageInput({ state, dispatch }) {
  const { url, filename, position } = state

  function handleFile(file) {
    const reader = new FileReader()
    reader.onload = function handleImgLoad(ev) {
      dispatch({
        type: 'SET_IMAGE',
        payload: {
          url: ev.target.result,
          filename: file.name
        }
      })
    }
    reader.readAsDataURL(file)
  }

  function handleRemove() {
    dispatch({ type: 'REMOVE_IMAGE' })
  }

  function setPosition(pos) {
    dispatch({ type: 'UPDATE_IMAGE_POSITION', payload: pos })
  }

  return url ? (
    <ImageEditor
      url={url}
      filename={filename}
      position={position}
      setPosition={setPosition}
      onRemove={handleRemove}
    />
  ) : (
    <ImageUploader onFileChange={handleFile} />
  )
}
