import { useAlert } from '@/lib/AlertContext'
import { supabase } from '@/lib/supabase'
import useProfile from '@/lib/useProfile'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Button from '../Button'
import Label from '../Label'
import Spinner from '../Spinner'

export default function CredentialsEdit() {
  const [email, setEmail] = useState(null)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const router = useRouter()
  const { user } = useProfile(router.query.id)
  const { setAlert } = useAlert()

  const emailValue = (email === null ? user?.email : email) || ''

  async function verifyCredentials(email, password) {
    const { data, error } = await supabase.auth.api.signInWithEmail(email, password)
    if (error) {
      throw error
    } else {
      return data
    }
  }

  async function updateCredentials(password) {
    const { data, error } = await supabase.auth.api.updateUser(data.access_token, { password })
    if (error) {
      throw error
    } else {
      return data
    }
  }

  async function handlePasswordSubmit(ev) {
    ev.preventDefault()

    setError(false)
    setLoading(true)
    try {
      await verifyCredentials(user.email, currentPassword)
      await updateCredentials(newPassword)
      setAlert({ type: 'success', text: 'Credenciales actualizadas correctamente' })
    } catch (error) {
      console.error(error)
      setError(true)
    }
    setLoading(false)
  }

  return (
    <div>
      <h2 className="text-xl font-medium">Credenciales</h2>
      <p className="mt-1 mb-6 text-sm text-gray-600">
        Informaci&oacute;n de inicio de sesi&oacute;n
      </p>
      <form onSubmit={handlePasswordSubmit}>
        <div className="mb-4">
          <Label name="email" text="Email" />
          <input
            disabled
            id="email"
            type="email"
            className="text-gray-500 bg-gray-100 w-full h-10 px-3 text-base placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-700 focus:border-red-700"
            placeholder="Escribe tu correo"
            value={emailValue}
            onChange={ev => setEmail(ev.target.value)}
            required
          />
        </div>
        <div className="mb-4 md:flex md:items-end md:space-x-2 space-y-4">
          <div className="w-full">
            <Label name="current_password" text="Contraseña actual" />
            <input
              id="current_password"
              type="password"
              autoComplete="current-password"
              className="w-full h-10 px-3 text-base placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-900 focus:border-red-900"
              placeholder="****"
              value={currentPassword}
              onChange={ev => setCurrentPassword(ev.target.value)}
            />
          </div>
          <div className="w-full">
            <Label name="new_password" text="Contraseña nueva" />
            <input
              id="new_password"
              type="password"
              autoComplete="new-password"
              className="w-full h-10 px-3 text-base placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-900 focus:border-red-900"
              placeholder="****"
              value={newPassword}
              onChange={ev => setNewPassword(ev.target.value)}
            />
          </div>
        </div>
        <Button
          type="submit"
          disabled={loading}
          hasIcon={loading ? 'left' : null}
          className="block ml-auto border-none my-0 mx-0"
          color="text-white"
          background="bg-red-500 hover:bg-red-600 hover:shadow-md">
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
      {error && <p className="text-red-500 text-xs mt-1">La contraseña actual no es correcta</p>}
    </div>
  )
}
