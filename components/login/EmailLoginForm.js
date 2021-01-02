import { useEffect, useRef, useState } from 'react'
import Button from '../Button'
import MailIcon from '../icons/MailIcon'

export default function EmailLoginForm({ onSubmit, onCancel }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  // const [mailSent, setMailSent] = useState(false)
  const inputRef = useRef()

  useEffect(() => {
    if (inputRef) {
      inputRef.current.focus()
    }
  }, [])

  async function handleSubmit(ev) {
    ev.preventDefault()
    setLoading(true)
    await onSubmit({ name, email })
    setLoading(false)
  }

  return (
    <div className="text-left -mt-4 -mb-4 space-y-4">
      <p className="flex items-center text-md font-semibold space-x-2">
        <MailIcon height={20} width={20} />
        <span>Entrar con tu correo</span>
      </p>
      <form onSubmit={handleSubmit} className="mt-2">
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
        <label className="mt-4 text-sm text-gray-500 block mb-1" htmlFor="email">
          E-mail
        </label>
        <input
          id="email"
          type="email"
          className="w-full h-10 px-3 text-base placeholder-gray-500 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-900 focus:border-red-900"
          placeholder="Escribe tu correo"
          value={email}
          onChange={ev => setEmail(ev.target.value)}
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
                <div
                  style={{ borderRightColor: 'transparent' }}
                  className="w-6 h-6 border-2 border-white rounded-full loader-rotate"></div>
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
