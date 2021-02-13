import useProfile from '@/lib/data/useProfile'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import Avatar from '../Avatar'
import Button from '../Button'
import EditIcon from '../icons/EditIcon'

function getImgOptionValue(imgOption, user) {
  if (imgOption) {
    return imgOption
  }
  return user ? user.avatartype : 'gravatar'
}

export default function PhotoEdit({ onChange }) {
  const inputRef = useRef()
  const router = useRouter()
  const { user } = useProfile(router.query.id)
  const [imgOption, setImgOption] = useState(null)
  const imgOptionValue = getImgOptionValue(imgOption, user)
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
      setImgOption('custom')
      onChange({
        type: 'custom',
        url
      })
    }
    reader.readAsDataURL(file)
  }

  function setGravatar() {
    setPreviewURL(null)
    setImgOption('gravatar')
    onChange({
      type: 'gravatar'
    })
  }

  return (
    <div className="mb-6">
      <p className="text-sm text-gray-700 font-medium mb-2">Avatar</p>
      <div className="flex items-center relative">
        <Avatar className="mr-6" size={80} user={user} preview={previewURL} />
        <div className="flex items-center absolute -top-1 left-14">
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
            className="rounded-full"
            color="text-blue-500"
            background="bg-white hover:shadow-md"
            hasIcon="left">
            <EditIcon height={20} width={20} />
          </Button>
        </div>
        <div>
          <label className="flex items-center mt-3">
            <input
              type="radio"
              name="avatartype"
              value="custom"
              checked={imgOptionValue === 'custom'}
              onChange={ev => setImgOption(ev.target.value)}
              className="h-5 w-5 text-blue-500"
            />
            <span className="ml-2 text-gray-700">Personalizado</span>
          </label>
          <label className="flex items-center mt-3">
            <input
              type="radio"
              name="avatartype"
              value="gravatar"
              checked={imgOptionValue === 'gravatar'}
              onChange={() => setGravatar()}
              className="h-5 w-5 text-blue-500"
            />
            <div className="ml-2 text-gray-700">
              <span>Gravatar</span>
              <a
                className="text-xs ml-2 text-blue-500"
                href="https://es.gravatar.com"
                target="_blank"
                rel="noreferrer noopener">
                ¿grava-qu&eacute;?
              </a>
            </div>
          </label>
        </div>
      </div>
    </div>
  )
}
