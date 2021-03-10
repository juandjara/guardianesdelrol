import PostCard from '@/components/posts/PostCard'
import useAuthGuard from '@/lib/auth/useAuthGuard'
import usePosts, { DEFAULT_RPP } from '@/lib/posts/usePosts'
import Tag from '@/components/Tag'
import Button from '@/components/Button'
import AddIcon from '@/components/icons/AddIcon'
import Link from 'next/link'
import { useRouter } from 'next/router'
import SearchBox from '@/components/SearchBox'
import Pagination from '@/components/Pagination'
import { useQueryParams } from '@/lib/useQueryParams'
import PostFiltersPanel from '@/components/posts/PostFiltersPanel'
import Title from '@/components/Title'

function PostListHeader({ count }) {
  return (
    <header className="relative flex items-end">
      <h1 className="flex items-center text-xl font-semibold tracking-wide space-x-3">
        <Tag color="red">{count}</Tag>
        <span>Partidas</span>
      </h1>
      <div className="flex-grow"></div>
      <SearchBox route="/posts" />
      <PostFiltersPanel />
      <Link href="/posts/edit/new">
        <a className="hover:no-underline">
          <Button
            small
            hasIcon="left"
            className="my-1"
            background="bg-red-500 hover:bg-red-400 hover:bg-opacity-100"
            color="text-white"
            border="border-none">
            <AddIcon className="-ml-1" width={20} height={20} />
            <span>Nueva partida</span>
          </Button>
        </a>
      </Link>
    </header>
  )
}

export default function PostList() {
  useAuthGuard()
  const router = useRouter()
  const { query, params } = useQueryParams()
  const { posts, count, loading } = usePosts(query)
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
    <main className="relative flex-auto container mx-auto p-3">
      <Title title="Partidas" />
      <PostListHeader count={count} />
      {empty && <p className="text-white text-lg mt-1">No hay partidas para estos filtros</p>}
      <ul className="grid gap-4 grid-cols-cards mt-2">
        {loading && (
          <>
            <PostCard />
            <PostCard />
            <PostCard />
          </>
        )}
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </ul>
      <Pagination onChange={handlePageChange} page={page} rpp={rpp} count={count} />
    </main>
  )
}
