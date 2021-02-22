import useSections from '@/lib/data/useSections'
import { useQueryParams } from '@/lib/useQueryParams'
import { useEffect, useState } from 'react'
import Button from '../Button'
import FilterIcon from '../icons/FilterIcon'
import Select from '../Select'

export default function PostFiltersPanel() {
  const [open, setOpen] = useState(false)

  const { params } = useQueryParams()

  const { sections } = useSections()
  const sectionOptions = sections.map(s => ({ value: s.id, label: s.name }))
  const sectionId = params.s || ''
  const initialSection = sectionOptions.find(s => s.value === sectionId)
  const [section, setSection] = useState(initialSection)

  const [typePresential, setTypePresential] = useState(!params.t || params.t === 'presencial')
  const [typeOnline, setTypeOnline] = useState(!params.t || params.t === 'online')

  useEffect(() => {
    setSection(initialSection)
  }, [initialSection])

  useEffect(() => {
    setTypeOnline(!params.t || params.t === 'presencial')
    setTypePresential(!params.t || params.t === 'online')
  }, [params.t])

  return (
    <div className="md:relative">
      <Button
        small
        hasIcon="only"
        className="my-1 mr-2"
        background="bg-red-900 hover:bg-red-700"
        color="text-white"
        border="border-none"
        onClick={() => setOpen(true)}>
        <FilterIcon className="md:ml-1" width={20} height={20} />
        <span className="md:inline hidden">Filtrar</span>
      </Button>
      <div
        className={`${
          open ? 'scale-x-100 visible' : 'scale-x-0 invisible'
        } space-y-4 rounded-md bg-red-900 bg-opacity-90 absolute z-20 w-full md:w-96 md:mr-2 py-2 px-3 top-full right-0 md:origin-right transition-transform`}>
        <header className="flex items-center -mr-2">
          <p className="flex-grow text-xl font-medium">Filtros</p>
          <Button
            small
            className="mx-1"
            background="hover:bg-gray-100 hover:bg-opacity-25"
            color="text-white"
            border="border-none">
            <span>Limpiar</span>
          </Button>
          <Button
            small
            className="mx-1"
            background="hover:bg-gray-100 hover:bg-opacity-25"
            color="text-indigo-300"
            border="border-none">
            <span>Aplicar</span>
          </Button>
        </header>
        <div>
          <p className="text-sm text-gray-100 mb-1">Tipo</p>
          <div className="space-x-6">
            <label className="inline-flex space-x-1 items-center">
              <input
                type="checkbox"
                className="rounded-sm text-red-500"
                checked={typeOnline}
                onChange={ev => setTypeOnline(ev.target.checked)}
              />
              <span>Online</span>
            </label>
            <label className="inline-flex space-x-1 items-center">
              <input
                type="checkbox"
                className="rounded-sm text-red-500"
                checked={typePresential}
                onChange={ev => setTypePresential(ev.target.checked)}
              />
              <span>Presencial</span>
            </label>
          </div>
        </div>
        <Select
          label="Seccion"
          noSelectionLabel="Todas"
          className="w-64"
          options={sectionOptions}
          selected={section}
          onChange={setSection}
        />
      </div>
    </div>
  )
}
