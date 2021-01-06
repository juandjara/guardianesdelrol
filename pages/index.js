import { getAggregates } from '@/data/aggregates'
import Button from '@/components/Button'
import ArrowIcon from '@/components/icons/ArrowIcon'
import Link from 'next/link'

export default function Home({ data }) {
  return (
    <main className="flex-auto max-w-prose mx-auto mt-6 text-center">
      <h1 className="text-6xl font-bold">Guardianes del Rol</h1>
      <p className="text-lg leading-relaxed md:leading-loose mt-6 px-4">
        ¡Bienvenido a Guardianes del Rol! En este portal podr&aacute;s encontrar las partidas de rol
        publicadas por nuestra asociaci&oacute;n as&iacute; como apuntarte para participar.
        Tambi&eacute;n podr&aacute;s ver el cat&aacute;logo de juegos que tenemos disponible para
        retar a un m&aacute;ster a dirigir una aventura.
      </p>
      <Link href="/posts">
        <a className="hover:no-underline inline-block text-center my-9">
          <Button hasIcon="right">
            <span>Ir a las partidas</span>
            <ArrowIcon height={24} width={24} />
          </Button>
        </a>
      </Link>
      <p className="text-base">Hasta ahora hemos disfrutado de:</p>
      <div className="space-y-4 my-2">
        <p className="flex items-baseline space-x-4">
          <strong className="text-right flex-1 text-5xl">{data.posts}</strong>
          <span className="text-left flex-1 text-base">partidas &uacute;nicas</span>
        </p>
        <p className="flex items-baseline space-x-4">
          <strong className="text-right flex-1 text-5xl">{data.games}</strong>
          <span className="text-left flex-1 text-base">juegos distintos</span>
        </p>
        <p className="flex items-baseline space-x-4">
          <strong className="text-right flex-1 text-5xl">{data.narrators}</strong>
          <span className="text-left flex-1 text-base">narradores diferentes</span>
        </p>
      </div>
    </main>
  )
}

export async function getStaticProps() {
  const data = await getAggregates()
  return {
    props: { data },
    revalidate: 1
  }
}
