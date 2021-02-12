import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { useAlert } from '@/components/AlertContext'
import { supabase } from '@/lib/supabase'
import { useSession } from '@/lib/auth/UserContext'
import translateErrorMessage from '@/lib/translateErrorMessage'
import Button from '@/components/Button'
import Label from '@/components/Label'
import Spinner from '@/components/Spinner'
import LockIcon from '@/components/icons/LockIcon'
import BackIcon from '@/components/icons/BackIcon'
import PasswordInput from '@/components/PasswordInput'
import WeakPasswordWarning from '@/components/WeakPasswordWarning'

export default function SignUp() {
  const inputRef = useRef()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordValid, setPasswordValid] = useState(true)
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
      <div className="flex md:h-full justify-between bg-white text-gray-700 rounded-lg">
        <div className="bg-gray-100 rounded-l-lg px-4 hidden md:flex flex-col justify-center">
          <Image
            width={346}
            height={400}
            title="Hola! Me alegro de verte"
            alt="mano que dice Hola! Me alegro de verte"
            className="opacity-75"
            priority
            src="/img/illustration_hello.png"
          />
        </div>
        <form
          onSubmit={handleSubmit}
          style={{ width: '28rem', maxWidth: 'calc(100vw - 24px)' }} // width from max-w-md
          className="flex flex-col justify-center text-left md:px-6 px-4 py-4">
          <header className="flex items-center mb-6">
            <button
              title="Volver"
              aria-label="Volver"
              type="button"
              onClick={() => router.back()}
              className="rounded-full p-2 bg-opacity-20 text-gray-600 bg-gray-200 hover:bg-opacity-50 focus:outline-none focus:ring focus:ring-offset-0 focus:ring-blue-500 focus:ring-offset-transparent">
              <BackIcon width={20} height={20} />
            </button>
            <h1 className="text-lg pl-2">Crear cuenta</h1>
          </header>
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
            <PasswordInput
              id="password"
              required
              placeholder="Escribe tu contraseña"
              value={password}
              onChange={setPassword}
              onValidityChange={setPasswordValid}
            />
          </div>
          <Button
            disabled={loading || !email || !password || !passwordValid}
            hasIcon="left"
            type="submit"
            className="w-full my-0 mx-0 hover:shadow-md border-red-500 hover:border-red-600"
            color="text-white"
            background="bg-red-500 hover:bg-red-600">
            {loading ? <Spinner size={6} color="white" /> : <LockIcon width={20} height={20} />}
            <span>Crear cuenta</span>
          </Button>
          {!passwordValid && <WeakPasswordWarning margin="mt-4" />}
        </form>
      </div>
    </main>
  )
}
