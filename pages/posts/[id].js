import { withAuthGuard } from '@/lib/auth'

function PostDetails () {
  return (
    <main className="flex-auto">
      <h1 className="text-6xl font-bold">Post Details</h1>
    </main>
  )
}

export default withAuthGuard(PostDetails)
