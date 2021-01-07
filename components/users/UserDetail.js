import useUserDetail from '@/lib/useUserDetail'
import useUsers from '@/lib/useUsers'
import { useRouter } from 'next/router'
import Skeleton from 'react-loading-skeleton'
import Avatar from '../Avatar'
import Button from '../Button'
import EditIcon from '../icons/EditIcon'
import Tag from '../Tag'

function getTag(user) {
  if (user?.superadmin) {
    return <Tag>SUPERADMIN</Tag>
  }
  if (user?.admin) {
    return <Tag>ADMIN</Tag>
  }
  return null
}

export default function UserDetail() {
  const router = useRouter()
  const currentId = router.query.id
  const { users } = useUsers()
  const user = (users || []).find(u => u.id === currentId)
  const { aggs } = useUserDetail(user?.email)

  return (
    <div className="bg-white w-full md:w-3/4 md:rounded-r-lg border-l border-gray-200 text-gray-700 pb-4">
      <header className="space-x-4 flex items-center py-2 px-4 border-b border-gray-200">
        <button onClick={() => router.back()} className="rounded-full p-2 hover:bg-gray-100">
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
        <div className="truncate flex-auto">
          <p className="font-semibold text-lg">
            <span>{user?.displayName || <Skeleton />} </span>
            {getTag(user)}
          </p>
          <p className="text-sm truncate text-gray-500">
            {aggs ? `${aggs.asPlayer.length} partidas` : <Skeleton />}
          </p>
        </div>
      </header>
      <main className="mx-4">
        <div className="-mx-4 h-36 w-auto bg-yellow-500"></div>
        <div className="flex justify-between">
          <Avatar className="-mt-12" border="border-white" size={96} user={user} />
          <Button
            hasIcon="left"
            className="rounded-full mx-0"
            color="text-blue-500 hover:text-white"
            background="bg-white hover:bg-blue-500 hover:border-blue-500 hover:shadow-md">
            <EditIcon width={20} height={20} />
            <span>Editar</span>
          </Button>
        </div>
        <div>
          <p className="font-semibold text-lg">{user?.displayName || <Skeleton />}</p>
          <p>{aggs ? aggs.gamesPlayed.slice(0, 3).concat('...').join(', ') : <Skeleton />}</p>
          <br />
          <p className="text-base mb-2">
            <strong>{aggs ? aggs.asPlayer.length : <Skeleton />} </strong>
            <span>partidas jugadas</span>
          </p>
          <p className="text-base mb-2">
            <strong>{aggs ? aggs.asNarrator.length : <Skeleton />} </strong>
            <span>partidas creadas</span>
          </p>
          <p className="text-base mb-2">
            <strong>{aggs ? aggs.gamesPlayed.length : <Skeleton />} </strong>
            <span>juegos distintos jugados</span>
          </p>
          <p className="text-base mb-2">
            <strong>{aggs ? aggs.gamesNarrated.length : <Skeleton />} </strong>
            <span>juegos distintos narrados</span>
          </p>
        </div>
      </main>
    </div>
  )
}
