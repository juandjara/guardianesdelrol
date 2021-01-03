import { useAlert } from '@/lib/alerts'
import { useAuth } from '@/lib/auth'
import { Transition } from '@headlessui/react'
import { useEffect, useRef, useState } from 'react'
import Button from '../Button'
import MailIcon from '../icons/MailIcon'

export default function EmailLoginForm({ next, onCancel }) {
  const inputRef = useRef()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('juanorigami@gmail.com')
  const [loading, setLoading] = useState(false)
  const [mailSent, setMailSent] = useState(true)
  const { emailSignIn } = useAuth()
  const { setAlert } = useAlert()

  const emailDomain = email.split('@')[1]

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  async function handleSubmit(ev) {
    ev.preventDefault()

    setLoading(true)
    try {
      await emailSignIn({ email, name, next })
      setMailSent(true)
    } catch (err) {
      console.error(err)
      setAlert(err.message)
    }
    setLoading(false)
  }

  if (mailSent) {
    return (
      <div className="space-y-4 flex flex-col items-center justify-center">
        <Transition
          show={true}
          appear={true}
          enter="transition transform duration-500"
          enterFrom="-translate-x-32 scale-50 opacity-0"
          enterTo="-translate-x-0 scale-100 opacity-100">
          <div className="mx-auto rounded-full w-16 h-16 bg-gray-200 flex items-center justify-center">
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
                d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76"
              />
            </svg>
          </div>
        </Transition>
        <p className="text-xl font-medium">Tienes un e-mail!</p>
        <p className="text-base max-w-lg">
          Comprueba tu bandeja de entrada para encontrar el enlace que te hemos enviado y completar
          el inicio de sesión.
        </p>
        <a className="hover:no-underline" href={`http://${emailDomain}`} rel="noopener">
          <Button
            className="shadow-md border-none"
            color="text-white"
            background="bg-red-500 hover:bg-red-600">
            Ir a {emailDomain}
          </Button>
        </a>
      </div>
    )
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
