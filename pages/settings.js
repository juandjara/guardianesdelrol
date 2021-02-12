import useAuthGuard from '@/lib/auth/useAuthGuard'
import ProfileEdit from '@/components/profile/ProfileEdit'
import CredentialsEdit from '@/components/profile/CredentialsEdit'
import RoleEdit from '@/components/profile/RoleEdit'
import { useRouter } from 'next/router'
import BackIcon from '@/components/icons/BackIcon'

export default function Settings() {
  useAuthGuard()
  const router = useRouter()

  return (
    <main className="flex-auto mt-4 px-3">
      <header className="max-w-screen-md mx-auto flex items-center space-x-4">
        <button
          title="Volver"
          aria-label="Volver"
          onClick={() => router.back()}
          className="rounded-full p-2 bg-opacity-20 text-white bg-gray-50 hover:bg-opacity-50 focus:outline-none focus:ring focus:ring-offset-0 focus:ring-blue-500 focus:ring-offset-transparent">
          <BackIcon height={20} width={20} />
        </button>
        <h1 className="text-2xl font-bold">Mi cuenta</h1>
      </header>
      <div className="bg-white text-gray-700 rounded-lg mt-4 p-4 max-w-screen-md mx-auto">
        <header>
          <h2 className="text-lg font-medium leading-6 text-gray-900">Perfil p&uacute;blico</h2>
          <p className="mt-1 mb-6 text-sm text-gray-600">
            Informaci&oacute;n p&uacute;blica visible para otros usuarios
          </p>
        </header>
        <ProfileEdit />
      </div>
      <div className="bg-white text-gray-700 rounded-lg mt-8 p-4 max-w-screen-md mx-auto">
        <CredentialsEdit />
      </div>
      <div className="bg-white text-gray-700 rounded-lg mt-8 p-4 max-w-screen-md mx-auto">
        <RoleEdit />
      </div>
    </main>
  )
}
