import { useAlert } from '@/lib/AlertContext'
import { supabase } from '@/lib/supabase'
import { useState } from 'react'
import Button from '../Button'
import Label from '../Label'
import Spinner from '../Spinner'

export default function CredentialsEdit({ user }) {
  const [email, setEmail] = useState(null)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { setAlert } = useAlert()

  const emailValue = (email === null ? user?.email : email) || ''

  async function verifyCredentials(email, password) {
    if (!password) {
      return { error: null }
    }
    return await supabase.auth.api.signInWithEmail(email, password)
  }

  async function handlePasswordSubmit(ev) {
    ev.preventDefault()

    setError(null)
    setLoading(true)
    const { error, data } = await verifyCredentials(user.email, currentPassword)
    if (error) {
      setError(error)
    } else {
      const { error } = await supabase.auth.api.updateUser(data.access_token, {
        email: emailValue || undefined,
        password: newPassword || undefined
      })
      if (error) {
        setError(error)
      } else {
        setAlert({ type: 'success', text: 'Credenciales actualizadas correctamente' })
      }
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
        {/* TODO: comprobar que el cambio de email funciona */}
        <div className="mb-4">
          <Label name="email" text="Email" />
          <input
            readOnly
            id="email"
            type="email"
            className="w-full h-10 px-3 text-base placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-700 focus:border-red-700"
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
