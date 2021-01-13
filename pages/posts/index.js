import useAuthGuard from '@/lib/useAuthGuard'

export default function PostList() {
  useAuthGuard()
  return (
    <main className="flex-auto">
      <h1 className="text-6xl font-bold">Post List</h1>
    </main>
  )
}
