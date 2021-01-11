import { useAuthGuard } from '@/lib/UserContext'

export default function PostDetails() {
  useAuthGuard()
  return (
    <main className="flex-auto">
      <h1 className="text-6xl font-bold">Post Details</h1>
    </main>
  )
}
