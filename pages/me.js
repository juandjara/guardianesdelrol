import Button from '@/components/Button'
import UserIcon from '@/components/icons/UserIcon'
import Spinner from '@/components/Spinner'
import { useAlert } from '@/lib/alerts'
import { signOut, useAuth, withAuthGuard } from '@/lib/auth'
import Image from 'next/image'
import { useState } from 'react'

function Me() {
  return (
    <main className="flex-auto mt-4 px-4">
      <h1 className="text-6xl font-bold text-center">Cuenta</h1>
      <div className="space-y-6 bg-white text-gray-700 rounded-lg mt-8 p-4 pb-6 max-w-3xl mx-auto">
        <PhotoEdit />
        <NameEdit />
        <ChallengeEdit />
      </div>
    </main>
  )
}

function PhotoEdit() {
  const { user } = useAuth()

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
              <button onClick={signOut} className="text-blue-400 hover:underline">
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
              <svg
                height={20}
                width={20}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              <span>Editar</span>
            </Button>
            <Button
              disabled={!user}
              className="border-none mx-0 my-0 font-none"
              color="text-red-700"
              background="bg-white hover:underline"
              hasIcon="left">
              <svg
                height={20}
                width={20}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Eliminar</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

function NameEdit() {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const { setAlert } = useAlert()
  const { user } = useAuth()

  async function handleNameChange(ev) {
    ev.preventDefault()
    setLoading(true)
    try {
      await user.updateProfile({ displayName: name || user.displayName })
    } catch (err) {
      console.error(err)
      setAlert(err.message)
    }
    setLoading(false)
  }

  return (
    <div className="flex-auto">
      <label className="mb-1 text-sm text-gray-500 block" htmlFor="name">
        Nombre
      </label>
      <form className="flex" onSubmit={handleNameChange}>
        <input
          id="name"
          className="w-full h-10 px-3 text-base placeholder-gray-500 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-900 focus:border-red-900"
          placeholder="Escribe tu nombre"
          value={name || user?.displayName || ''}
          onChange={ev => setName(ev.target.value)}
          required
        />
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
      </form>
    </div>
  )
}

function ChallengeEdit() {
  const [challenge, setChallenge] = useState(false)
  // const [loading, setLoading] = useState(false)
  // const { user } = useAuth()

  function handleSubmit(ev) {
    ev.preventDefault()
  }

  return (
    <form onSubmit={handleSubmit}>
      <p className="text-sm text-gray-500 mb-1">Preferencias</p>
      <div className="flex items-start">
        <input
          id="challenge"
          name="challenge"
          type="checkbox"
          checked={challenge}
          onChange={ev => setChallenge(ev.target.checked)}
          className="h-5 w-5 text-blue-500 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label htmlFor="challenge" className="flex-auto ml-2 block text-sm text-gray-900">
          Disponible para la sección <strong>Reta a un máster</strong>
        </label>
        {/* <Button
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
        </Button> */}
      </div>
    </form>
  )
}

export default withAuthGuard(Me)
