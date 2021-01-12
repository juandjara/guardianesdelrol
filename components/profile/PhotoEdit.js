import { supabase } from '@/lib/supabase'
import { useSession } from '@/lib/UserContext'
import Image from 'next/image'
import Button from '../Button'
import DeleteIcon from '../icons/DeleteIcon'
import EditIcon from '../icons/EditIcon'
import UserCircleIcon from '../icons/UserCircleIcon'

export default function PhotoEdit() {
  const { user } = useSession()

  return (
    <div className="mb-4">
      <p className="text-sm text-gray-700 font-medium mb-2">Avatar</p>
      <div className="flex items-center">
        <div className="text-sm w-16 h-16 text-white bg-red-900 rounded-full">
          {user?.photoURL ? (
            <Image width={64} height={64} className="rounded-full" src={user.photoURL} />
          ) : (
            <UserCircleIcon className="mx-auto h-full" width={64} />
          )}
        </div>
        {user?.isAnonymous ? (
          <div className="text-sm ml-2">
            <p className="mt-2 text-gray-700 mb-1">
              Un usuario invitado no puede editar su foto de perfil.
            </p>
            <p>
              <span>Prueba a</span>{' '}
              <button
                onClick={() => supabase.auth.signOut()}
                className="text-blue-400 hover:underline">
                cerrar sesión
              </button>{' '}
              <span>y usar otro metodo de inicio de sesión</span>
            </p>
          </div>
        ) : (
          <div className="flex items-center">
            <Button
              small
              disabled={!user}
              className="mx-0 ml-3"
              color="text-blue-500"
              background="bg-white hover:shadow-md"
              hasIcon="left">
              <EditIcon height={20} width={20} />
              <span>Editar</span>
            </Button>
            <Button
              small
              disabled={!user}
              className="mx-0 ml-3"
              color="text-red-700"
              background="bg-white hover:shadow-md"
              hasIcon="left">
              <DeleteIcon height={20} width={20} />
              <span>Eliminar</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
