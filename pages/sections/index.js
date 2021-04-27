import Button from '@/components/Button'
import SectionCard from '@/components/sections/SectionCard'
import AddIcon from '@/components/icons/AddIcon'
import Tag from '@/components/Tag'
import useAuthGuard from '@/lib/auth/useAuthGuard'
import Link from 'next/link'
import Title from '@/components/Title'
import useSections from '@/lib/useSections'

function ListHeader({ count }) {
  return (
    <header className="relative flex items-end">
      <h1 className="flex items-center text-xl font-semibold tracking-wide space-x-3">
        <Tag color="red">{count}</Tag>
        <span>Eventos</span>
      </h1>
      <div className="flex-grow"></div>
      <Link href="/events/edit/new">
        <a className="hover:no-underline">
          <Button
            small
            hasIcon="left"
            className="my-1"
            background="bg-red-500 hover:bg-red-400 hover:bg-opacity-100"
            color="text-white"
            border="border-none">
            <AddIcon className="-ml-1" width={20} height={20} />
            <span>Nuevo evento</span>
          </Button>
        </a>
      </Link>
    </header>
  )
}

export default function SectionsList() {
  useAuthGuard()
  const { sections, loading } = useSections()
  const empty = sections.length === 0

  return (
    <main className="flex-auto mx-auto p-3 max-w-4xl w-full">
      <Title title="Eventos" />
      <ListHeader count={sections.length} />
      {empty && <p className="text-white text-lg mt-1">No hay eventos guardados</p>}
      <ul className="mt-2 space-y-4">
        {loading && (
          <>
            <SectionCard />
            <SectionCard />
            <SectionCard />
          </>
        )}
        {sections.map(section => (
          <SectionCard key={section.id} section={section} />
        ))}
      </ul>
    </main>
  )
}
