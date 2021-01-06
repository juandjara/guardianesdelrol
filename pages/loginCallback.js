import { useAlert } from '@/lib/alerts'
import { completeEmailSignIn, useAuth } from '@/lib/auth'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function LoginCallback() {
  const { setUser } = useAuth()
  const { setAlert } = useAlert()
  const router = useRouter()

  useEffect(() => {
    async function callback() {
      try {
        const name = router.query.displayName
        const next = router.query.next
        const user = await completeEmailSignIn(name)
        setUser(user)
        router.replace(next || '/')
      } catch (err) {
        console.error(err)
        setAlert(err.message)
        router.replace('/login')
      }
    }

    callback()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <main className="space-y-2 flex-auto flex flex-col items-center justify-center">
      <svg
        className="animate-bounce"
        width={64}
        height={64}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
        />
      </svg>
      <p className="text-lg font-medium">Comprobando identidad ...</p>
    </main>
  )
}
