import Button from '@/components/Button'
import DeleteIcon from '@/components/icons/DeleteIcon'
import EditIcon from '@/components/icons/EditIcon'
import Spinner from '@/components/Spinner'
import { useAuthGuard, useSession } from '@/lib/UserContext'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import { useState } from 'react'
import UserCircleIcon from '@/components/icons/UserCircleIcon'
import { useAlert } from '@/lib/AlertContext'

export default function MyAccount() {
  useAuthGuard()
  return (
    <main className="flex-auto mt-4 px-4">
      <h1 className="text-6xl font-bold text-center">Mi Cuenta</h1>
      <div className="bg-white text-gray-700 rounded-lg mt-8 p-4 max-w-3xl mx-auto">
        <PhotoEdit />
        <ProfileEdit />
      </div>
      <div className="bg-white text-gray-700 rounded-lg mt-8 p-4 max-w-3xl mx-auto">
        <PasswordEdit />
      </div>
    </main>
  )
}

function PhotoEdit() {
  const { user } = useSession()

  return (
    <div className="flex-auto mb-4">
      <h2 className="text-lg font-medium leading-6 text-gray-900">Perfil</h2>
      <p className="mt-1 mb-6 text-sm text-gray-600">
        Informaci&oacute;n p&uacute;blica visible para otros usuarios
      </p>

      <p className="text-sm text-gray-700 font-medium mb-2">Avatar</p>
      <div className="flex items-center">
        <div className="text-sm w-16 h-16 text-white bg-red-900 rounded-full">
          {user?.photoURL ? (
            <Image width={64} height={64} className="rounded-full" src={user.photoURL} />
          ) : (
            <UserCircleIcon className="mx-auto h-full" width={64} />
          )}
        </div>
        {user?.isAnonymous ? (
          <div className="text-sm ml-2">
            <p className="mt-2 text-gray-700 mb-1">
              Un usuario invitado no puede editar su foto de perfil.
            </p>
            <p>
              <span>Prueba a</span>{' '}
              <button
                onClick={() => supabase.auth.signOut()}
                className="text-blue-400 hover:underline">
                cerrar sesión
              </button>{' '}
              <span>y usar otro metodo de inicio de sesión</span>
            </p>
          </div>
        ) : (
          <div className="flex items-center">
            <Button
              small
              disabled={!user}
              className="mx-0 ml-3"
              color="text-blue-500"
              background="bg-white hover:shadow-md"
              hasIcon="left">
              <EditIcon height={20} width={20} />
              <span>Editar</span>
            </Button>
            <Button
              small
              disabled={!user}
              className="mx-0 ml-3"
              color="text-red-700"
              background="bg-white hover:shadow-md"
              hasIcon="left">
              <DeleteIcon height={20} width={20} />
              <span>Eliminar</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

function ProfileEdit() {
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
          <label htmlFor="name" className="text-sm text-gray-700 font-medium block">
            Nombre
          </label>
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
          <label htmlFor="bio" className="text-sm text-gray-700 font-medium block">
            Bio
          </label>
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
        <label htmlFor="challenge" className="flex-auto ml-2 block text-sm text-gray-900">
          Disponible para la sección <strong>Reta a un narrador</strong>
        </label>
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

function PasswordEdit() {
  const { user } = useSession()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { setAlert } = useAlert()

  async function handleSubmit(ev) {
    ev.preventDefault()

    setError(null)
    setLoading(true)
    const { error } = await supabase.auth.api.signInWithEmail(user.email, currentPassword)
    if (error) {
      setError(error)
    } else {
      const { error } = await supabase.auth.update({ password: newPassword })
      if (error) {
        setError(error)
      } else {
        setAlert({ type: 'success', text: 'Contraseña actualizada correctamente' })
      }
    }
    setLoading(false)
  }

  return (
    <div>
      <h2 className="text-xl font-medium mb-4 md:mb-2">Cambiar contraseña</h2>
      <form onSubmit={handleSubmit} className="md:flex md:items-end md:space-x-2 space-y-4">
        <div className="w-full">
          <label className="mb-1 text-sm text-gray-700 font-medium block" htmlFor="name">
            Contraseña actual
          </label>
          <input
            id="current_password"
            type="password"
            autoComplete="current-password"
            className="w-full h-10 px-3 text-base placeholder-gray-500 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-900 focus:border-red-900"
            placeholder="****"
            value={currentPassword}
            onChange={ev => setCurrentPassword(ev.target.value)}
            required
          />
        </div>
        <div className="w-full">
          <label className="mb-1 text-sm text-gray-700 font-medium block" htmlFor="name">
            Contraseña nueva
          </label>
          <input
            id="new_password"
            type="password"
            autoComplete="new-password"
            className="w-full h-10 px-3 text-base placeholder-gray-500 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-900 focus:border-red-900"
            placeholder="****"
            value={newPassword}
            onChange={ev => setNewPassword(ev.target.value)}
            required
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          hasIcon={loading ? 'left' : null}
          className="w-full md:w-auto border-none my-0 mx-0"
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
      {error && <p className="text-red-500 text-xs mt-1">La contraseña actual no es correcta</p>}
    </div>
  )
}
