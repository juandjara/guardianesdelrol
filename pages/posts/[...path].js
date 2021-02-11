import Button from '@/components/Button'
import BackIcon from '@/components/icons/BackIcon'
// import useAuthGuard from '@/lib/useAuthGuard'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function PostDetails() {
  const router = useRouter()

  return (
    <main className="flex-auto mx-auto p-3 max-w-4xl w-full">
      <div className="bg-white text-gray-700 pb-6 rounded-lg relative">
        <div className="z-20 w-full absolute top-0 left-0 p-2 flex items-start justify-between">
          <button
            title="Volver"
            aria-label="Volver"
            onClick={() => router.back()}
            className="rounded-full p-2 bg-opacity-50 text-white bg-gray-500 hover:bg-opacity-75 focus:outline-none focus:ring focus:ring-offset-0 focus:ring-blue-500 focus:ring-offset-transparent">
            <BackIcon height={20} width={20} />
          </button>
          <Link href={`/edit/post/{id}`}>
            <a>
              <Button className="mx-0 my-0" small>
                Editar
              </Button>
            </a>
          </Link>
        </div>
        <div className="h-64 relative clip-vertical bg-gray-100 rounded-t-lg"></div>
        <header className="px-4 my-4">
          <h1 className="text-red-700 text-xl font-semibold">Nombre de la partida</h1>
          <p className="text-base mt-2">Nombre del Juego</p>
        </header>
        <div className="space-y-6 p-4"></div>
      </div>
    </main>
  )
}
