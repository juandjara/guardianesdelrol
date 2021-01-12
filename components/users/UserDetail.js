import useUsers from '@/lib/useUsers'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Skeleton from 'react-loading-skeleton'
import Avatar from '../Avatar'
import Button from '../Button'
import CloseIcon from '../icons/CloseIcon'
import EditIcon from '../icons/EditIcon'
import Tag from '../Tag'

export default function UserDetail() {
  const router = useRouter()
  const currentId = router.query.id
  const { users } = useUsers()
  const user = (users || []).find(u => u.id === currentId)
  const aggs = {
    asPlayer: [],
    asNarrator: [],
    gamesPlayed: [],
    gamesNarrated: []
  }

  return (
    <div className="bg-white w-full md:w-3/4 md:rounded-r-lg border-l border-gray-200 text-gray-700 pb-4">
      <header className="space-x-4 flex items-center py-2 px-4 border-b border-gray-200">
        <Link href="/users">
          <button className="rounded-full p-2 bg-gray-50 hover:bg-gray-100">
            <CloseIcon height={20} width={20} />
          </button>
        </Link>
        <div className="truncate flex-auto">
          <h1 className="font-semibold text-lg">
            {user ? user.displayName || 'Aventurero sin nombre' : <Skeleton />}
          </h1>
          <p className="text-sm truncate text-gray-500">
            {aggs ? `${aggs.asPlayer.length} partidas` : <Skeleton />}
          </p>
        </div>
      </header>
      <section className="mx-4">
        <div className="-mx-4 h-36 w-auto pattern-bg"></div>
        <div className="relative md:flex items-center">
          <div className="-mt-12">
            <Avatar border="border-gray-100" size={96} user={user} />
          </div>
          <div className="mt-2 md:ml-2">
            <p className="font-semibold text-lg">
              <span>{user ? user.displayName || 'Aventurero sin nombre' : <Skeleton />} </span>
              {user?.role && <Tag>{user.role}</Tag>}
            </p>
            <p className="mb-2 text-sm truncate text-gray-500">
              {user ? user.email : <Skeleton />}
            </p>
            <p className="text-base">{user ? user.bio : <Skeleton />}</p>
          </div>
          <Button
            small
            hasIcon="left"
            className="mx-0"
            color="text-blue-500 w-auto hover:text-white"
            background="absolute md:top-0 top-12 right-0 bg-white hover:bg-blue-500 hover:border-blue-500 hover:shadow-md">
            <EditIcon width={20} height={20} />
            <span>Editar</span>
          </Button>
        </div>
        <div>
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
      </section>
    </div>
  )
}
