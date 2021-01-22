import Button from '@/components/Button'
import Label from '@/components/Label'
import Spinner from '@/components/Spinner'
import { useAlert } from '@/lib/AlertContext'
import { supabase } from '@/lib/supabase'
import { useEffect, useRef, useState } from 'react'
import LockIcon from '@/components/icons/LockIcon'
import { useRouter } from 'next/router'
import { useSession } from '@/lib/UserContext'

export default function SignUp() {
  const inputRef = useRef()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const session = useSession()
  const { setAlert } = useAlert()

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  useEffect(() => {
    if (session) {
      router.push('/settings')
    }
  }, [session, router])

  async function handleSubmit(ev) {
    ev.preventDefault()

    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      console.error(error)
      const defaultMessage = 'A user with this email address has already been registered'
      if (error.message === defaultMessage) {
        error.message = 'Ya existe un usuario con este email'
      }
      setAlert(error.message)
    }
    setLoading(false)
  }

  return (
    <main className="flex-auto mt-4 px-4">
      <header className="max-w-md mx-auto flex items-center space-x-4">
        <button
          title="Volver"
          aria-label="Volver"
          onClick={() => router.back()}
          className="rounded-full p-2 bg-opacity-20 text-white bg-gray-50 hover:bg-opacity-50 focus:outline-none focus:ring focus:ring-offset-0 focus:ring-blue-500 focus:ring-offset-transparent">
          <svg
            height={20}
            width={20}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </button>
        <h1 className="text-2xl font-bold">Crear cuenta</h1>
      </header>
      <form
        onSubmit={handleSubmit}
        className="bg-white text-gray-700 rounded-lg mt-4 p-5 max-w-md mx-auto">
        <div>
          <Label name="email" text="E-mail" />
          <input
            ref={inputRef}
            id="email"
            type="email"
            className="w-full h-10 px-3 text-base placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-700 focus:border-red-700"
            placeholder="Escribe tu correo"
            value={email}
            onChange={ev => setEmail(ev.target.value)}
            required
          />
        </div>
        <div className="my-5">
          <Label name="password" text="Contraseña" />
          <input
            id="password"
            type="password"
            required
            className="w-full h-10 px-3 text-base placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-700 focus:border-red-700"
            placeholder="Escribe tu contraseña"
            value={password}
            onChange={ev => setPassword(ev.target.value)}
          />
        </div>
        <Button
          disabled={loading || !email || !password}
          hasIcon="left"
          type="submit"
          className="w-full my-0 mx-0 hover:shadow-md border-red-500 hover:border-red-600"
          color="text-white"
          background="bg-red-500 hover:bg-red-600">
          {loading ? <Spinner size={6} color="white" /> : <LockIcon width={20} height={20} />}
          <span>Entrar</span>
        </Button>
      </form>
    </main>
  )
}
