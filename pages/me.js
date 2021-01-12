import { useAuthGuard } from '@/lib/UserContext'
import PhotoEdit from '@/components/profile/PhotoEdit'
import ProfileEdit from '@/components/profile/ProfileEdit'
import CredentialsEdit from '@/components/profile/CredentialsEdit'

export default function MyAccount() {
  useAuthGuard()
  return (
    <main className="flex-auto mt-4 px-4">
      <h1 className="text-6xl font-bold text-center">Mi Cuenta</h1>
      <div className="bg-white text-gray-700 rounded-lg mt-8 p-4 max-w-3xl mx-auto">
        <h2 className="text-lg font-medium leading-6 text-gray-900">Perfil p&uacute;blico</h2>
        <p className="mt-1 mb-6 text-sm text-gray-600">
          Informaci&oacute;n p&uacute;blica visible para otros usuarios
        </p>
        <PhotoEdit />
        <ProfileEdit />
      </div>
      <div className="bg-white text-gray-700 rounded-lg mt-8 p-4 max-w-3xl mx-auto">
        <CredentialsEdit />
      </div>
    </main>
  )
}
