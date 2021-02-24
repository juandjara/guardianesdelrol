import Image from 'next/image'
import { useState } from 'react'
import Button from './Button'

export default function ImageUploader() {
  const [imageURL, setImageURL] = useState(null)

  function handleFile(ev) {
    const file = ev.target.files[0]
    const reader = new FileReader()
    reader.onload = function handleImgLoad(ev) {
      const url = ev.target.result
      setImageURL(url)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="mt-1 relative">
      {imageURL && <Image className="z-20" alt="" src={imageURL} layout="fill" objectFit="cover" />}
      <div className="px-6 pt-9 pb-8 space-y-1 flex flex-col items-center border-2 border-gray-300 border-dashed rounded-md">
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
