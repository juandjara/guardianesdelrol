import Button from '@/components/Button'
import Label from '@/components/Label'
import Spinner from '@/components/Spinner'
import { useAlert } from '@/lib/AlertContext'
import { supabase } from '@/lib/supabase'
import { useEffect, useRef, useState } from 'react'
import MailIcon from '@/components/icons/MailIcon'
import LockIcon from '@/components/icons/LockIcon'
import { useRouter } from 'next/router'
import translateErrorMessage from '@/lib/translateErrorMessage'
import BackIcon from '@/components/icons/BackIcon'

function EmailForm() {
  const inputRef = useRef()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const { setAlert } = useAlert()

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  async function handleSubmit(ev) {
    ev.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.api.resetPasswordForEmail(email)
    if (error) {
      setAlert(error)
    } else {
      router.push({
        pathname: 'mailSent',
        query: {
          action: 'recovery',
          to: email.split('@')[1]
        }
      })
    }
    setLoading(false)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white text-gray-700 rounded-lg mt-4 p-5 max-w-md mx-auto">
      <div className="mb-6">
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
      <Button
        disabled={loading || !email}
        hasIcon="left"
        type="submit"
        className="w-full my-0 mx-0 hover:shadow-md border-red-500 hover:border-red-600"
        color="text-white"
        background="bg-red-500 hover:bg-red-600">
        {loading ? <Spinner size={6} color="white" /> : <MailIcon width={20} height={20} />}
        <span>Enviar correo de recuperaci&oacute;n</span>
      </Button>
    </form>
  )
}

function PasswordForm() {
  const inputRef = useRef()
  const router = useRouter()
  const hash = router.asPath.split('#')[1]
  const token = new URLSearchParams(hash).get('t')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { setAlert } = useAlert()

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  async function handleSubmit(ev) {
    ev.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.api.updateUser(token, { password })
    if (error) {
      setAlert(translateErrorMessage(error.message))
    } else {
      setAlert({ type: 'success', text: 'Contraseña actualizada correctamente' })
      router.push('/settings')
    }
    setLoading(false)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white text-gray-700 rounded-lg mt-4 p-5 max-w-md mx-auto">
      <div className="mb-6">
        <Label name="password" text="Nueva contraseña" />
        <input
          ref={inputRef}
          id="password"
          type="password"
          className="w-full h-10 px-3 text-base placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-700 focus:border-red-700"
          placeholder="Escribe tu contraseña nueva"
          value={password}
          onChange={ev => setPassword(ev.target.value)}
          required
        />
      </div>
      <Button
        disabled={loading || !password}
        hasIcon="left"
        type="submit"
        className="w-full my-0 mx-0 hover:shadow-md border-red-500 hover:border-red-600"
        color="text-white"
        background="bg-red-500 hover:bg-red-600">
        {loading ? <Spinner size={6} color="white" /> : <LockIcon width={20} height={20} />}
        <span>Cambiar contraseña</span>
      </Button>
    </form>
  )
}

export default function RecoveryPassword() {
  const router = useRouter()
  const form = router.query.form

  return (
    <main className="flex-auto mt-4 px-3">
      <header className="max-w-md mx-auto flex items-center space-x-4">
        <button
          title="Volver"
          aria-label="Volver"
          onClick={() => router.back()}
          className="rounded-full p-2 bg-opacity-20 text-white bg-gray-50 hover:bg-opacity-50 focus:outline-none focus:ring focus:ring-offset-0 focus:ring-blue-500 focus:ring-offset-transparent">
          <BackIcon width={20} height={20} />
        </button>
        <h1 className="text-2xl font-bold">Recuperar contraseña</h1>
      </header>
      {form === 'email' && <EmailForm />}
      {form === 'pass' && <PasswordForm />}
    </main>
  )
}
