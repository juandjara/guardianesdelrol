import { supabase } from '@/lib/supabase'
import Avatar from '../Avatar'
import Button from '../Button'
import EditIcon from '../icons/EditIcon'

export default function PhotoEdit({ user }) {
  return (
    <div className="mb-4">
      <p className="text-sm text-gray-700 font-medium mb-2">Avatar</p>
      <div className="flex items-center">
        <Avatar size={80} user={user} />
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
              color="text-gray-700"
              background="bg-white hover:shadow-md"
              hasIcon="left">
              <svg
                height={20}
                width={20}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Descartar</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
