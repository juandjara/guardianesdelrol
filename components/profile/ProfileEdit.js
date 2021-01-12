import { useSession } from '@/lib/UserContext'
import { useState } from 'react'
import Button from '../Button'
import Label from '../Label'
import Spinner from '../Spinner'

export default function ProfileEdit() {
  const [name, setName] = useState(null)
  const [bio, setBio] = useState(null)
  const [challenge, setChallenge] = useState(null)
  const [loading, setLoading] = useState(false)
  const { user, updateProfile } = useSession()

  const nameValue = (name === null ? user?.displayName : name) || ''
  const bioValue = (bio === null ? user?.bio : bio) || ''
  const checkboxValue = (challenge === null ? user?.challengeable : challenge) || false

  async function handleSubmit(ev) {
    ev.preventDefault()

    setLoading(true)
    await updateProfile({
      id: user?.id,
      displayName: nameValue,
      challengeable: checkboxValue,
      bio: bioValue
    })
    setLoading(false)
  }

  const NAME_MAXLENGTH = 50
  const BIO_MAXLENGTH = 250

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <div className="mb-1 w-full md:w-1/2 flex items-center justify-between">
          <Label name="name" text="Nombre" />
          <p className="text-xs text-gray-500">
            {nameValue.length} / {NAME_MAXLENGTH}
          </p>
        </div>
        <input
          id="name"
          className="md:w-1/2 w-full h-10 px-3 text-base placeholder-gray-500 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-900 focus:border-red-900"
          placeholder="Escribe tu nombre"
          maxLength={NAME_MAXLENGTH}
          value={nameValue}
          onChange={ev => setName(ev.target.value)}
          required
        />
      </div>
      <div>
        <div className="mb-1 flex items-center justify-between">
          <Label name="bio" text="Bio" />
          <p className="text-xs text-gray-500">
            {bioValue.length} / {BIO_MAXLENGTH}
          </p>
        </div>
        <textarea
          rows="3"
          name="bio"
          value={bioValue}
          maxLength={BIO_MAXLENGTH}
          onChange={ev => setBio(ev.target.value)}
          className="shadow-sm block w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-900 focus:border-red-900"
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
          className="h-5 w-5 text-indigo-500 focus:outline-none focus:ring-offset-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded"
        />
        <Label
          name="challenge"
          margin="ml-1"
          text={
            <span>
              Disponible para la sección <strong>Reta a un narrador</strong>
            </span>
          }
        />
      </div>
      <Button
        type="submit"
        disabled={loading || !user}
        hasIcon={loading ? 'left' : null}
        className="block ml-auto border-none my-0 mx-0"
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
    </form>
  )
}
