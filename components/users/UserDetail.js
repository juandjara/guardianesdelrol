import useProfile from '@/lib/auth/useProfile'
import useRoleCheck from '@/lib/auth/useRoleCheck'
import usePostsForUser from '@/lib/posts/usePostsForUsers'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Skeleton from 'react-loading-skeleton'
import Avatar from '../Avatar'
import Button, { buttonFocusStyle } from '../Button'
import CloseIcon from '../icons/CloseIcon'
import EditIcon from '../icons/EditIcon'
import PostListItem from '../posts/PostListItem'
import RoleTags from '../RoleTags'

function getAggs(posts, user) {
  const asdm = []
  const asplayer = []
  for (const post of posts) {
    if (post.narrator.id === user?.id) {
      asdm.push(post)
    } else {
      asplayer.push(post)
    }
  }
  return { asdm, asplayer }
}

export default function UserDetail() {
  const router = useRouter()
  const { user } = useProfile(router.query.id)
  const { posts } = usePostsForUser(router.query.id)
  const { asdm, asplayer } = getAggs(posts, user)
  const roleCheck = useRoleCheck('superadmin', user?.id)

  return (
    <div className="bg-white relative md:rounded-r-lg md:border-l border-gray-200 text-gray-700 pb-4">
      {roleCheck && (
        <header className="flex items-center justify-between m-2 absolute top-0 left-0 right-0">
          <Link href="/users">
            <button
              title="Cerrar"
              aria-label="Cerrar"
              className={`p-2 rounded-full bg-opacity-20 text-white bg-gray-50 hover:bg-opacity-50 ${buttonFocusStyle}`}>
              <CloseIcon height={20} width={20} />
            </button>
          </Link>
          <Link href={`/settings?id=${user?.id}`}>
            <a>
              <Button
                small
                hasIcon="left"
                color="w-auto text-white"
                background="bg-red-700 hover:bg-red-600 hover:shadow-lg">
                <EditIcon width={20} height={20} />
                <span>Editar</span>
              </Button>
            </a>
          </Link>
        </header>
      )}
      <div className="mx-4">
        <div className="-mx-4 h-36 md:rounded-tr-lg w-auto pattern-bg"></div>
        <div className="relative md:flex items-center">
          <div className="-mt-12">
            <Avatar border="border-gray-100" size={92} user={user} />
          </div>
          <div className="mt-2 md:ml-2">
            <p className="space-x-1 font-semibold text-lg">
              <span>{user ? user.displayName : <Skeleton />} </span>
              <RoleTags user={user} />
            </p>
            <p className="mt-1 text-sm text-gray-600">{user ? user.bio : <Skeleton />}</p>
          </div>
        </div>
        <div className="mt-8">
          <p className="text-base text-gray-400 mb-4 mr-2">
            <span className="text-2xl text-gray-700 font-medium mr-1">{asdm.length}</span>
            {asdm.length === 1 ? 'partida narrada' : 'partidas narradas'}
          </p>
          <ul className="space-y-4">
            {asdm.map(post => (
              <PostListItem key={post.id} post={post} />
            ))}
          </ul>
        </div>
        <div className="mt-8">
          <p className="text-base text-gray-400 mb-4 mr-2">
            <span className="text-2xl text-gray-700 font-medium mr-1">{asplayer.length}</span>
            {asplayer.length === 1 ? 'partida jugada' : 'partidas jugadas'}
          </p>
          <ul className="space-y-4">
            {asplayer.map(post => (
              <PostListItem key={post.id} post={post} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
