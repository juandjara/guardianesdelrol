import { useAlert } from '@/lib/AlertContext'
import { useEffect, useRef, useState } from 'react'
import Button from '@/components/Button'
import LockIcon from '@/components/icons/LockIcon'
import MailIcon from '@/components/icons/MailIcon'
import UserIcon from '@/components/icons/UserIcon'
import Spinner from '@/components/Spinner'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/router'
import MailSentScreen from '@/components/login/MailSentScreen'
import GoogleLoginButton from '@/components/login/GoogleLoginButton'

export default function Login() {
  const inputRef = useRef()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [loading, setLoading] = useState(false)
  const [mailSent, setMailSent] = useState(false)
  const { setAlert } = useAlert()
  const router = useRouter()
  const next = router.query.next

  useEffect(() => {
    if (next) {
      setAlert('Es necesario iniciar sesión para continuar')
    }
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [next, setAlert])

  async function handleSubmit(ev) {
    ev.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signIn({ email, password })
    if (error) {
      console.error(error)
      setAlert(error.message)
    } else {
      if (password) {
        if (next) {
          router.replace(next)
        } else {
          router.push('/me?type=signin')
        }
      } else {
        setMailSent(true)
      }
    }
    setLoading(false)
  }

  async function createAccount() {
    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      console.error(error)
      setAlert(error.message)
    }
    setLoading(false)
  }

  function anonLogin() {
    // TODO
  }

  if (mailSent) {
    return <MailSentScreen email={email} />
  }

  const buttonText = password.length ? 'Entrar' : 'Enviar enlace único'
  const Icon = password.length ? LockIcon : MailIcon
  const iconTitle = password.length
    ? ''
    : 'Un enlace único es un enlace que se envia a tu dirección de correo para que puedas entrar sin necesidad de recordar una contraseña'

  return (
    <main className="flex-auto mt-4 px-4">
      <h1 className="text-6xl text-center font-bold">Iniciar sesi&oacute;n</h1>
      <div className="bg-white text-gray-700 rounded-lg mt-8 px-4 py-8 max-w-xl mx-auto flex flex-col">
        <div className="divide-y divide-gray-300">
          <form onSubmit={handleSubmit} className="text-left">
            <div>
              <label className="text-gray-700 block mb-1" htmlFor="email">
                E-mail
              </label>
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
            <div className="mt-6 mb-8">
              <div className="flex justify-between items-end mb-1">
                <label className="text-gray-500" htmlFor="email">
                  Contraseña
                </label>
                <a href="/recovery" className="text-sm text-red-600 hover:text-red-700">
                  ¿Olvidaste tu contraseña?
                </a>
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
            <div className="md:flex items-center space-y-4 md:space-y-0 md:space-x-4">
              <Button
                onClick={createAccount}
                disabled={loading || !password || !email}
                className="w-full md:w-1/2 mx-0 my-0"
                type="button"
                color="text-red-500 hover:text-red-700"
                background="bg-white hover:shadow-md">
                Crear cuenta
              </Button>
              <Button
                disabled={loading || !email}
                hasIcon="left"
                type="submit"
                title={iconTitle}
                className="w-full md:w-1/2 my-0 mx-0 hover:shadow-md border-red-500 hover:border-red-600"
                color="text-white"
                background="bg-red-500 hover:bg-red-600">
                {loading ? <Spinner size={6} color="white" /> : <Icon width={20} height={20} />}
                <span>{buttonText}</span>
              </Button>
            </div>
          </form>
          <div className="flex flex-col mt-8 pt-8 space-y-4">
            <GoogleLoginButton />
            <Button
              onClick={anonLogin}
              disabled={loading}
              hasIcon="left"
              className="mx-0 my-0"
              color="text-gray-700"
              background="bg-white hover:shadow-md"
              border="border-gray-200 hover:border-gray-300">
              {loading ? <Spinner size={6} color="white" /> : <UserIcon width={20} height={20} />}
              <span className="w-40 text-left">Entrar como invitado</span>
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
