import Button from '@/components/Button'
import Label from '@/components/Label'
import Spinner from '@/components/Spinner'
import { useAlert } from '@/lib/AlertContext'
import { supabase } from '@/lib/supabase'
import { useEffect, useRef, useState } from 'react'
import LockIcon from '@/components/icons/LockIcon'
import { useRouter } from 'next/router'
import { useSession } from '@/lib/UserContext'
import translateErrorMessage from '@/lib/translateErrorMessage'
import BackIcon from '@/components/icons/BackIcon'
import Image from 'next/image'

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
      setAlert(translateErrorMessage(error.message))
    }
    setLoading(false)
  }

  return (
    <main className="flex flex-col items-center justify-center flex-auto my-4 px-3">
      <div className="relative flex md:h-full justify-between bg-white text-gray-700 rounded-lg">
        <button
          title="Volver"
          aria-label="Volver"
          onClick={() => router.back()}
          className="absolute top-2 left-2 rounded-full p-2 bg-opacity-20 text-gray-600 bg-gray-200 hover:bg-opacity-50 focus:outline-none focus:ring focus:ring-offset-0 focus:ring-blue-500 focus:ring-offset-transparent">
          <BackIcon width={20} height={20} />
        </button>
        <div className="bg-gray-100 rounded-l-lg px-4 hidden md:flex flex-col justify-center">
          <Image
            width="346"
            height="400"
            alt="mano que dice hola"
            className="opacity-75"
            priority
            src="/img/illustration_hello.png"
          />
        </div>
        <form
          onSubmit={handleSubmit}
          style={{ width: '28rem', maxWidth: 'calc(100vw - 24px)' }} // width from max-w-md
          className="flex flex-col justify-center text-left md:px-6 px-4 pb-4 pt-3 md:pt-4">
          <h1 className="pl-10 md:pl-0 text-lg mb-6">Crear cuenta</h1>
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
          <div className="my-8">
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
            <span>Crear cuenta</span>
          </Button>
        </form>
      </div>
    </main>
  )
}
