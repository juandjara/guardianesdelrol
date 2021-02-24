import Button from '@/components/Button'
import ArrowIcon from '@/components/icons/ArrowIcon'
import UserCircleIcon from '@/components/icons/UserCircleIcon'
import { supabase } from '@/lib/data/supabase'
import Link from 'next/link'

/*
 * TODO: hace mas claro el proposito de esta web en esta pagina
 * el proposito final de esta plataforma es
 * "unir a narradores que buscan jugadores con jugadores que busquen partidas"
 * y de ahi nace todo lo demas
 * todas las demas features son derivadas de esa
 */

export default function Landing({ data }) {
  return (
    <main className="px-3 my-4 container mx-auto flex-auto flex flex-col justify-center">
      <header>
        <h1 className="text-6xl font-bold">Guardianes del Rol</h1>
        <p className="mt-4 max-w-prose text-justify text-lg leading-normal md:leading-relaxed">
          ¡Bienvenido, forastero! Este es el punto de encuentro donde los miembros de Guardianes
          planifican sus viajes a otros mundos. Podrás participar en estas aventuras e incluso
          formar tu propio equipo de leyenda. Nuestros narradores siempre están a disposición de sus
          jugadores y algunos incluso acpetan retos para crear nuevas partidas.
          <br /> ¡Adéntrate con nosotros en el maravilloso mundo del rol!
        </p>
      </header>
      <div className="md:flex space-y-10 md:space-y-0 md:space-x-14 my-14">
        <div className="flex items-center">
          <svg
            height={52}
            width={52}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
              clipRule="evenodd"
            />
          </svg>
          <p className="ml-6 flex items-start flex-col">
            <strong className="text-6xl font-semibold">{data.posts}</strong>
            <span className="text-xl font-medium tracking-wide">Partidas</span>
          </p>
        </div>
        <div className="flex items-center">
          <svg
            height={52}
            width={52}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor">
            <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
          </svg>
          <p className="ml-6 flex items-start flex-col">
            <strong className="text-6xl font-semibold">{data.games}</strong>
            <span className="text-xl font-medium tracking-wide">Juegos</span>
          </p>
        </div>
        <div className="flex items-center">
          <UserCircleIcon height={52} width={52} />
          <p className="ml-6 flex items-start flex-col">
            <strong className="text-6xl font-semibold">{data.dms}</strong>
            <span className="text-xl font-medium tracking-wide">Narradores</span>
          </p>
        </div>
      </div>
      <Link href="/login">
        <a className="hover:no-underline inline-block">
          <Button
            hasIcon="right"
            className="tracking-wide text-lg py-3 pl-6 pr-4 rounded-lg shadow-lg">
            <span>ENTRAR</span>
            <ArrowIcon height={24} width={24} />
          </Button>
        </a>
      </Link>
    </main>
  )
}

export async function getStaticProps() {
  const { data, error } = await supabase.rpc('get_landing_aggs')
  if (error) {
    console.error(error)
  }

  return {
    props: { data },
    revalidate: 1
  }
}
