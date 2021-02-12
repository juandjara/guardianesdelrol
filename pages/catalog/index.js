import GameCard from '@/components/GameCard'
import Spinner from '@/components/Spinner'
import useAuthGuard from '@/lib/auth/useAuthGuard'
import useGames, { fetchGames } from '@/lib/data/useGames'
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

  return (
    <main className="flex-auto mx-auto p-3 max-w-4xl w-full">
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
