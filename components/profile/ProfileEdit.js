import { useAlert } from '@/components/AlertContext'
import { updateProfile } from '@/lib/auth/authService'
import { supabase } from '@/lib/data/supabase'
import useProfile from '@/lib/data/useProfile'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { mutate } from 'swr'
import Button from '../Button'
import Label from '../Label'
import Spinner from '../Spinner'
import PhotoEdit from './PhotoEdit'

export default function ProfileEdit() {
  const [name, setName] = useState(null)
  const [bio, setBio] = useState(null)
  const [challenge, setChallenge] = useState(null)
  const [avatar, setAvatar] = useState(null)

  const router = useRouter()
  const { user, loading } = useProfile(router.query.id)
  const { setAlert } = useAlert()

  const nameValue = (name === null ? user?.displayName : name) || ''
  const bioValue = (bio === null ? user?.bio : bio) || ''
  const checkboxValue = (challenge === null ? user?.challengeable : challenge) || false

  async function handleAvatarUpload() {
    const session = supabase.auth.session()
    const formData = new FormData()
    formData.set('file', avatar.url)
    formData.set('token', session.access_token)
    return await axios.post('/api/upload/avatar', formData)
  }

  async function handleSubmit(ev) {
    ev.preventDefault()
    try {
      if (avatar?.type === 'custom') {
        await handleAvatarUpload()
      }
      await mutate(`profile/${user.id}`, async user => {
        const avatartype = avatar?.type || user.avatartype
        const data = await updateProfile({
          id: user.id,
          avatartype,
          displayName: nameValue,
          challengeable: checkboxValue,
          bio: bioValue
        })
        return { ...user, ...data }
      })
      setAlert({ type: 'success', text: 'Perfil actualizado correctamente' })
    } catch (error) {
      console.error(error)
      setAlert(error.message)
    }
  }

  const NAME_MAXLENGTH = 50
  const BIO_MAXLENGTH = 250

  return (
    <form className="space-y-6 flex-auto" onSubmit={handleSubmit}>
      <PhotoEdit onChange={setAvatar} />
      <div className="max-w-sm">
        <div className="mb-1 w-full flex items-center justify-between">
          <Label name="name" text="Nombre" />
          <p className="text-xs text-gray-500">
            {nameValue.length} / {NAME_MAXLENGTH}
          </p>
        </div>
        <input
          id="name"
          type="text"
          className="w-full h-10 px-3 text-base placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-700 focus:border-red-700"
          placeholder="Escribe tu nombre"
          maxLength={NAME_MAXLENGTH}
          value={nameValue}
          onChange={ev => setName(ev.target.value)}
          required
        />
      </div>
      <div className="max-w-lg">
        <div className="mb-1 flex items-center justify-between">
          <Label name="bio" text="Bio" />
          <p className="text-xs text-gray-500">
            {bioValue.length} / {BIO_MAXLENGTH}
          </p>
        </div>
        <textarea
          rows="3"
          id="bio"
          value={bioValue}
          maxLength={BIO_MAXLENGTH}
          onChange={ev => setBio(ev.target.value)}
          className="shadow-sm block w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-700 focus:border-red-700"
        />
        <p className="text-sm text-gray-500 mt-1">Breve descripci&oacute;n de tu perfil</p>
      </div>
      <div className="flex items-center">
        <input
          id="challenge"
          name="challenge"
          type="checkbox"
          checked={checkboxValue}
          onChange={ev => setChallenge(ev.target.checked)}
          className="h-5 w-5 text-blue-500 focus:outline-none focus:ring-offset-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded"
        />
        <Label name="challenge" margin="ml-2" text="Disponible para retos" />
      </div>
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={loading || !user}
          hasIcon={loading ? 'left' : null}
          border="border-none"
          color="text-white"
          background="bg-red-500 hover:bg-red-600 hover:shadow-md">
          {loading ? (
            <>
              <Spinner size={5} color="white" />
              <span>Guardar</span>
            </>
          ) : (
            'Guardar'
          )}
        </Button>
      </div>
    </form>
  )
}
