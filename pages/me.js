import Button from '@/components/Button'
import DeleteIcon from '@/components/icons/DeleteIcon'
import EditIcon from '@/components/icons/EditIcon'
import UserIcon from '@/components/icons/UserIcon'
import Spinner from '@/components/Spinner'
import { useAuthGuard, useSession } from '@/lib/UserContext'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import { useState } from 'react'

export default function MyAccount() {
  useAuthGuard()
  return (
    <main className="flex-auto mt-4 px-4">
      <h1 className="text-6xl font-bold text-center">Mi Cuenta</h1>
      <div className="space-y-6 bg-white text-gray-700 rounded-lg mt-8 p-4 pb-6 max-w-3xl mx-auto">
        <PhotoEdit />
        <ProfileEdit />
      </div>
    </main>
  )
}

function PhotoEdit() {
  const { user } = useSession()

  return (
    <div className="flex-auto">
      <p className="text-sm text-gray-500 mb-2">Foto de perfil</p>
      <div className="flex items-center">
        <div className="text-sm w-16 h-16 border-2 border-indigo-200 text-white bg-red-900 rounded-full">
          {user?.photoURL ? (
            <Image width={64} height={64} className="rounded-full" src={user.photoURL} />
          ) : (
            <UserIcon className="mx-auto h-full" width={32} />
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
          <div>
            <Button
              disabled={!user}
              className="border-none mx-0 my-0 hover:underline"
              color="text-blue-500"
              background="bg-white"
              hasIcon="left">
              <EditIcon height={20} width={20} />
              <span>Editar</span>
            </Button>
            <Button
              disabled={!user}
              className="border-none mx-0 my-0 font-none"
              color="text-red-700"
              background="bg-white hover:underline"
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
  const [challenge, setChallenge] = useState(null)
  const [loading, setLoading] = useState(false)
  const { user, updateProfile } = useSession()

  const nameValue = (name === null ? user?.displayName : name) || ''
  const checkboxValue = (challenge === null ? user?.challengeable : challenge) || false

  async function handleSubmit(ev) {
    ev.preventDefault()

    setLoading(true)
    await updateProfile({
      id: user?.id,
      displayName: nameValue,
      challengeable: checkboxValue
    })
    setLoading(false)
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <label className="mb-1 text-sm text-gray-500 block" htmlFor="name">
          Nombre
        </label>
        <input
          id="name"
          className="w-full h-10 px-3 text-base placeholder-gray-500 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-900 focus:border-red-900"
          placeholder="Escribe tu nombre"
          value={nameValue}
          onChange={ev => setName(ev.target.value)}
          required
        />
      </div>
      <div className="flex items-center">
        <input
          id="challenge"
          name="challenge"
          type="checkbox"
          checked={checkboxValue}
          onChange={ev => setChallenge(ev.target.checked)}
          className="h-5 w-5 text-blue-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label htmlFor="challenge" className="flex-auto ml-2 block text-sm text-gray-900">
          Disponible para la sección <strong>Reta a un máster</strong>
        </label>
        <Button
          type="submit"
          disabled={loading || !user}
          hasIcon={loading ? 'left' : null}
          className="border-none my-0 mr-0"
          color="text-white"
          background="bg-red-500 hover:bg-red-600">
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
