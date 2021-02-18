import Button from '@/components/Button'
import GameCard from '@/components/GameCard'
import AddIcon from '@/components/icons/AddIcon'
import SearchIcon from '@/components/icons/SearchIcon'
import Spinner from '@/components/Spinner'
import Tag from '@/components/Tag'
import useAuthGuard from '@/lib/auth/useAuthGuard'
import useGames, { fetchGames } from '@/lib/data/useGames'
import Link from 'next/link'
import { useEffect, useRef } from 'react'

export default function GameList({ initialPage }) {
  useAuthGuard()
  const loaderRef = useRef(null)
  const { data, empty, finished, loading, page, setPage } = useGames(initialPage)

  useEffect(() => {
    function callback(entries) {
      const target = entries[0]
      if (target.isIntersecting && !loading && !finished) {
        setPage(page + 1)
      }
    }

    const observer = new IntersectionObserver(callback, { threshold: 0.25 })
    const node = loaderRef?.current
    if (node) {
      observer.observe(node)
    }

    return () => {
      if (node) observer.unobserve(node)
      observer.disconnect()
    }
  }, [loaderRef, loading, finished, page, setPage])

  const games = data && data.filter(Boolean).flatMap(d => d.rows)
  const count = data && data[0]?.count

  return (
    <main className="flex-auto mx-auto p-3 max-w-4xl w-full">
      <header className="flex items-end">
        <h1 className="flex items-center text-xl font-semibold tracking-wide space-x-3">
          {count && <Tag color="red">{count}</Tag>}
          <span>Juegos</span>
        </h1>
        <div className="flex-grow"></div>
        <Button
          small
          hasIcon="only"
          className="my-1 mr-2"
          background="bg-red-900 hover:bg-red-700"
          color="text-white"
          border="border-none">
          <SearchIcon className="md:ml-1" width={20} height={20} />
          <span className="md:inline hidden">B&uacute;squeda</span>
        </Button>
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
      {empty && <p className="text-white text-lg text-center">No hay juegos para estos filtros</p>}
      <ul className="mt-2 space-y-4">
        {games && games.map(game => <GameCard key={game.id} game={game} />)}
        {!finished && (
          <div ref={loaderRef}>
            <Spinner size={8} color="white" />
          </div>
        )}
      </ul>
    </main>
  )
}

export async function getStaticProps() {
  const page = await fetchGames()
  return {
    props: { initialPage: page },
    revalidate: 1
  }
}
