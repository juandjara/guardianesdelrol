import { useAlert } from '@/lib/AlertContext'
import { useEffect, useRef, useState } from 'react'
import Button from '@/components/Button'
import LockIcon from '@/components/icons/LockIcon'
import MailIcon from '@/components/icons/MailIcon'
import Spinner from '@/components/Spinner'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/router'
import GoogleLoginButton from '@/components/login/GoogleLoginButton'
import Label from '@/components/Label'
import { useSession } from '@/lib/UserContext'
import { useQueryParams } from '@/lib/useQueryParams'
import Link from 'next/link'
import translateErrorMessage from '@/lib/translateErrorMessage'

export default function Login() {
  const inputRef = useRef()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const query = useQueryParams()
  const next = query.get('next')
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
      if (next) {
        router.replace(next)
      } else {
        router.push('/settings')
      }
    } else {
      if (next) {
        setAlert('Es necesario iniciar sesión para continuar')
      }
    }
  }, [session, next, router, setAlert])

  async function handleSubmit(ev) {
    ev.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signIn({ email, password })
    if (error) {
      console.error(error)
      setAlert(translateErrorMessage(error.message))
    } else {
      if (!password) {
        router.push({
          pathname: 'mailSent',
          query: {
            action: 'login',
            to: email.split('@')[1]
          }
        })
      }
    }
    setLoading(false)
  }

  return (
    <main className="flex-auto mt-4 px-4">
      <h1 className="max-w-md mx-auto text-2xl font-bold">Iniciar sesi&oacute;n</h1>
      <div className="bg-white text-gray-700 rounded-lg mt-2 px-5 pt-6 pb-4 max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="flex flex-col text-left">
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
            <div className="flex justify-between items-end mb-1">
              <Label margin="mb-0" name="password" text="Contraseña" />
              <Link href="/recovery?form=email" className="text-sm text-blue-500">
                <a className="text-sm text-blue-500">Olvid&eacute; mi contraseña</a>
              </Link>
            </div>
            <input
              id="password"
              type="password"
              className="w-full h-10 px-3 text-base placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-700 focus:border-red-700"
              placeholder="Escribe tu contraseña"
              value={password}
              onChange={ev => setPassword(ev.target.value)}
            />
          </div>
          <div className="space-y-4">
            <Button
              disabled={loading || !email || !password}
              hasIcon="left"
              type="submit"
              className="w-full my-0 mx-0 hover:shadow-md border-red-500 hover:border-red-600"
              color="text-white"
              background="bg-red-500 hover:bg-red-600">
              {loading ? <Spinner size={6} color="white" /> : <LockIcon width={20} height={20} />}
              <span>Entrar con tu contraseña</span>
            </Button>
            <Button
              disabled={loading || !email}
              hasIcon="left"
              type="submit"
              className="w-full my-0 mx-0 hover:shadow-md border-blue-500 hover:border-blue-600"
              color="text-white"
              background="bg-blue-500 hover:bg-blue-600">
              {loading ? <Spinner size={6} color="white" /> : <MailIcon width={20} height={20} />}
              <span>Enviar enlace &uacute;nico*</span>
            </Button>
            <GoogleLoginButton />
          </div>
          <p className="mt-6 text-sm space-x-1">
            <span>¿Nuevo en la plataforma?</span>
            <span role="img" aria-label="dedo apuntando">
              👉
            </span>
            <Link href="/signup">
              <a className="text-blue-500">Crear cuenta</a>
            </Link>
          </p>
          <p className="mt-4 text-xs">
            <em>
              * Un enlace único es un enlace que se envia a tu dirección de correo para que puedas
              entrar sin necesidad de recordar una contraseña.
            </em>
          </p>
        </form>
      </div>
    </main>
  )
}
