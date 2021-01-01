import { withAuthGuard } from '@/lib/auth'

function PostList () {
  return (
    <main className="flex-auto">
      <h1 className="text-6xl font-bold">Post List</h1>
    </main>
  )
}

export default withAuthGuard(PostList)
