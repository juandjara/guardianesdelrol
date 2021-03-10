import useAuthGuard from '@/lib/auth/useAuthGuard'
import ProfileEdit from '@/components/profile/ProfileEdit'
import CredentialsEdit from '@/components/profile/CredentialsEdit'
import RoleEdit from '@/components/profile/RoleEdit'
import useProfile from '@/lib/data-fetch/useProfile'
import BackButton from '@/components/BackButton'

export default function Settings() {
  useAuthGuard()
  const { user } = useProfile()

  return (
    <main className="flex-auto mt-4 px-3">
      <header className="max-w-screen-md mx-auto flex items-center space-x-4">
        <BackButton colors="bg-opacity-20 text-white bg-gray-50 hover:bg-opacity-50" />
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
      {user?.role === 'superadmin' && (
        <div className="bg-white text-gray-700 rounded-lg mt-8 p-4 max-w-screen-md mx-auto">
          <RoleEdit />
        </div>
      )}
    </main>
  )
}
