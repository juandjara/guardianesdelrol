import Button from '@/components/Button'
import GameCard from '@/components/GameCard'
import AddIcon from '@/components/icons/AddIcon'
import Pagination from '@/components/Pagination'
import SearchBox from '@/components/SearchBox'
import Tag from '@/components/Tag'
import useAuthGuard from '@/lib/auth/useAuthGuard'
import useGames, { DEFAULT_RPP } from '@/lib/data/useGames'
import { useQueryParams } from '@/lib/useQueryParams'
import Link from 'next/link'
import { useRouter } from 'next/router'

function GameListHeader({ count }) {
  return (
    <header className="flex items-end">
      <h1 className="flex items-center text-xl font-semibold tracking-wide space-x-3">
        <Tag color="red">{count}</Tag>
        <span>Juegos</span>
      </h1>
      <div className="flex-grow"></div>
      <SearchBox route="/catalog" />
      <Link href="/edit/posts/new">
        <a className="hover:no-underline">
          <Button
            small
            hasIcon="left"
            className="my-1"
            background="bg-red-500 hover:bg-red-400 hover:bg-opacity-100"
            color="text-white"
            border="border-none">
            <AddIcon className="-ml-1" width={20} height={20} />
            <span>Nuevo juego</span>
          </Button>
        </a>
      </Link>
    </header>
  )
}

export default function GameList() {
  useAuthGuard()
  const router = useRouter()
  const { query, params } = useQueryParams()
  const { games, count, loading } = useGames(query)
  const empty = !loading && count === 0
  const page = Number(params.page || 0)
  const rpp = Number(params.rpp || DEFAULT_RPP)

  function handlePageChange(page) {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, page }
    })
  }

  return (
    <main className="flex-auto mx-auto p-3 max-w-4xl w-full">
      <GameListHeader count={count} />
      {empty && <p className="text-white text-lg mt-1">No hay juegos para estos filtros</p>}
      <ul className="mt-2 space-y-4">
        {games.map(game => (
          <GameCard key={game.id} game={game} />
        ))}
      </ul>
      <Pagination onChange={handlePageChange} page={page} rpp={rpp} count={count} />
    </main>
  )
}
