import Link from "next/link";

export default function NotFoundPage () {
  return (
    <main className="space-y-4 flex-auto flex flex-col items-center justify-center">
      <h1 className="text-6xl font-bold">404</h1>
      <h3 className="text-3xl">Aqu&iacute; no hay nada :c</h3>
      <Link href="/"><a className="text-xl">Volver al Inicio</a></Link>
    </main>
  )
}
