import { useState } from 'react'
import Button from '@/components/Button'
import Spinner from '@/components/Spinner'
import { updatePermissions } from '@/lib/authService'
import { useAlert } from '@/lib/AlertContext'
import { useRouter } from 'next/router'
import useProfile from '@/lib/useProfile'
import { mutate } from 'swr'

export default function RoleEdit() {
  const router = useRouter()
  const { user, loading } = useProfile(router.query.id)
  const { user: loggedUser } = useProfile()
  const { setAlert } = useAlert()

  const [role, setRole] = useState(null)
  const roleValue = (role === null ? user?.role : role) || 'normal'

  async function handleSubmit(ev) {
    ev.preventDefault()
    try {
      await mutate(`profile/${user.id}`, async user => {
        await updatePermissions({
          id: user.id,
          role: roleValue
        })
        return { ...user, role: roleValue }
      })
      setAlert({ type: 'success', text: 'Permisos actualizados correctamente' })
    } catch (error) {
      console.error(error)
      setAlert(error.message)
    }
  }

  if (loggedUser?.role !== 'superadmin') {
    return null
  }

  return (
    <div className="bg-white text-gray-700 rounded-lg mt-8 p-4 max-w-3xl mx-auto">
      <h2 className="text-xl font-medium mb-2">Permisos</h2>
      <form onSubmit={handleSubmit} className="md:flex space-y-2 items-start justify-between">
        <div className="flex space-x-6">
          <label className="inline-flex items-center mt-3">
            <input
              type="radio"
              name="role"
              value="normal"
              checked={roleValue === 'normal'}
              onChange={ev => setRole(ev.target.value)}
              className="h-5 w-5 text-blue-500"
            />
            <span className="ml-2 text-gray-700">Normal</span>
          </label>
          <label className="inline-flex items-center mt-3">
            <input
              type="radio"
              name="role"
              value="admin"
              checked={roleValue === 'admin'}
              onChange={ev => setRole(ev.target.value)}
              className="h-5 w-5 text-blue-500"
            />
            <span className="ml-2 text-gray-700">Admin</span>
          </label>
          <label className="inline-flex items-center mt-3">
            <input
              type="radio"
              name="role"
              value="superadmin"
              checked={roleValue === 'superadmin'}
              onChange={ev => setRole(ev.target.value)}
              className="h-5 w-5 text-blue-500"
            />
            <span className="ml-2 text-gray-700">Superadmin</span>
          </label>
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
    </div>
  )
}
