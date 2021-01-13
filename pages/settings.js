import useAuthGuard from '@/lib/useAuthGuard'
import PhotoEdit from '@/components/profile/PhotoEdit'
import ProfileEdit from '@/components/profile/ProfileEdit'
import CredentialsEdit from '@/components/profile/CredentialsEdit'
import { useSession } from '@/lib/UserContext'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { fetchProfile } from '@/lib/authService'
import { useAlert } from '@/lib/AlertContext'
import RoleEdit from '@/components/profile/RoleEdit'

export default function MyAccount() {
  useAuthGuard()

  const { setAlert } = useAlert()
  const { user: currentUser, setProfile: setCurrentUser } = useSession()
  const currentId = currentUser?.id
  const router = useRouter()
  const urlId = router.query.id
  const [urlUser, setUrlUser] = useState(null)

  const hasDifferentProfile = currentId && urlId && currentId !== urlId

  async function fetchURLProfile() {
    const { data, error } = await fetchProfile(urlId)
    if (error) {
      console.error(error)
      setAlert(error.message)
    } else {
      setUrlUser(data)
    }
  }

  useEffect(() => {
    if (hasDifferentProfile) {
      fetchURLProfile()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasDifferentProfile])

  const user = hasDifferentProfile ? urlUser : currentUser
  const setUser = hasDifferentProfile ? setUrlUser : setCurrentUser

  const showRoleEdit = currentUser?.role === 'superadmin' && hasDifferentProfile

  return (
    <main className="flex-auto mt-4 px-4">
      <h1 className="text-6xl font-bold text-center">Mi Cuenta</h1>
      <div className="relative bg-white text-gray-700 rounded-lg mt-8 p-4 max-w-3xl mx-auto">
        <button
          title="Volver"
          aria-label="Volver"
          onClick={() => router.back()}
          className="absolute -top-20 left-2 rounded-full p-2 bg-opacity-20 text-white bg-gray-50 hover:bg-opacity-50 focus:outline-none focus:ring focus:ring-offset-0 focus:ring-blue-500 focus:ring-offset-transparent">
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
        <h2 className="text-lg font-medium leading-6 text-gray-900">Perfil p&uacute;blico</h2>
        <p className="mt-1 mb-6 text-sm text-gray-600">
          Informaci&oacute;n p&uacute;blica visible para otros usuarios
        </p>
        <PhotoEdit user={user} />
        <ProfileEdit user={user} setUser={setUser} />
      </div>
      <div className="bg-white text-gray-700 rounded-lg mt-8 p-4 max-w-3xl mx-auto">
        <CredentialsEdit user={user} />
      </div>
      {showRoleEdit && (
        <div className="bg-white text-gray-700 rounded-lg mt-8 p-4 max-w-3xl mx-auto">
          <RoleEdit user={user} setUser={setUser} />
        </div>
      )}
    </main>
  )
}
