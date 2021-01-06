import { useAlert } from '@/lib/alerts'
import { anonSignIn, useAuth } from '@/lib/auth'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import Button from '../Button'
import UserIcon from '../icons/UserIcon'
import Spinner from '../Spinner'

export default function AnonLoginForm({ onCancel }) {
  const inputRef = useRef()
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const { setUser } = useAuth()
  const { setAlert } = useAlert()
  const router = useRouter()

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  async function handleSubmit(ev) {
    ev.preventDefault()

    setLoading(true)
    try {
      const user = await anonSignIn(name)
      setUser(user)
      router.replace(router.query.next || '/')
    } catch (err) {
      console.error(err)
      setAlert(err.message)
    }
    setLoading(false)
  }

  return (
    <div className="text-left -mt-4 -mb-4">
      <div>
        <p className="flex items-center text-md font-semibold space-x-2">
          <UserIcon height={20} width={20} />
          <span>Entrar como invitado</span>
        </p>
        <p className="text-sm text-gray-500 mt-2">
          <em>
            <span className="text-red-500">*</span>
            La información asociada con este usuario será borrada al cerrar sesión
          </em>
        </p>
      </div>
      <form onSubmit={handleSubmit} className="mt-6">
        <label className="text-sm text-gray-500 block mb-1" htmlFor="name">
          Nombre
        </label>
        <input
          ref={inputRef}
          id="name"
          className="w-full h-10 px-3 text-base placeholder-gray-500 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-900 focus:border-red-900"
          placeholder="Escribe tu nombre"
          value={name}
          onChange={ev => setName(ev.target.value)}
          required
        />
        <div className="flex justify-end mt-4 space-x-2">
          <Button
            onClick={onCancel}
            type="button"
            className="mx-0 my-0 border-none"
            color="color-gray-700"
            background="bg-white hover:bg-gray-100"
            border="border-gray-300">
            Cancelar
          </Button>
          <Button
            disabled={loading}
            hasIcon={loading ? 'left' : null}
            type="submit"
            className="mx-0 my-0 shadow-md border-none"
            color="text-white"
            background="bg-red-500 hover:bg-red-600">
            {loading ? (
              <>
                <Spinner size={6} color="white" />
                <span>Continuar</span>
              </>
            ) : (
              'Continuar'
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
