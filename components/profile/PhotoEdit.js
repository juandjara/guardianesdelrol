import { useRef, useState } from 'react'
import Avatar from '../Avatar'
import Button from '../Button'

export default function PhotoEdit({ user, onChange }) {
  const inputRef = useRef()
  const [previewURL, setPreviewURL] = useState(null)

  function toggleFile() {
    if (inputRef.current) {
      inputRef.current.click()
    }
  }

  function handleFile(ev) {
    const file = ev.target.files[0]
    const reader = new FileReader()
    reader.onload = function handleImgLoad(ev) {
      const url = ev.target.result
      setPreviewURL(url)
      onChange({ url, filename: file.name })
    }
    reader.readAsDataURL(file)
  }

  function clearAvatar() {
    setPreviewURL(null)
    onChange({ url: null })
  }

  return (
    <div className="mb-6">
      <p className="text-sm text-gray-700 font-medium mb-2">Avatar</p>
      <div className="flex items-center">
        <div className="group relative">
          {user.avatar && (
            <Button
              onClick={clearAvatar}
              type="button"
              border="border-none"
              background="bg-red-500 bg-opacity-20"
              color="text-white"
              title="Eliminar foto"
              className="group-hover:opacity-100 opacity-0 absolute inset-0 w-full z-10 rounded-full"
              hasIcon="only"
              small>
              <svg
                height={24}
                width={24}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </Button>
          )}
          <Avatar size={64} user={user} preview={previewURL} />
        </div>
        <input
          id="profile_picture"
          className="hidden"
          type="file"
          onChange={handleFile}
          ref={inputRef}
        />
        <Button
          small
          title="Subir nueva foto de perfil"
          aria-label="Subir nueva foto de perfil"
          disabled={!user}
          onClick={toggleFile}
          type="button"
          className="ml-2"
          background="bg-red-50 hover:bg-red-100">
          <span>Cambiar foto</span>
        </Button>
      </div>
    </div>
  )
}
