import { useState } from 'react'
import Button from '@/components/Button'
import Spinner from '@/components/Spinner'
import { updatePermissions } from '@/lib/auth/authService'
import { useAlert } from '@/components/AlertContext'
import { useRouter } from 'next/router'
import useProfile from '@/lib/data-fetch/useProfile'
import { mutate } from 'swr'

export default function RoleEdit() {
  const router = useRouter()
  const { user, loading } = useProfile(router.query.id)
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

  return (
    <>
      <h2 className="text-xl font-medium mb-2">Permisos</h2>
      <form onSubmit={handleSubmit} className="md:flex space-y-6 items-end justify-between">
        <div className="space-y-4">
          <label className="flex items-center mt-3">
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
          <label className="flex items-center mt-3">
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
          <label className="flex items-center mt-3">
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
          border="border-none"
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
    </>
  )
}
