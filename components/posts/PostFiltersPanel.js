import useSections from '@/lib/data/useSections'
import { useQueryParams } from '@/lib/useQueryParams'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import Button from '../Button'
import FilterIcon from '../icons/FilterIcon'
import Select from '../Select'

export default function PostFiltersPanel() {
  const router = useRouter()
  const { params } = useQueryParams()
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef(null)
  const hasFilters = Boolean(params.t || params.s || params.ofs)

  const { sections } = useSections()
  const initialSectionId = Number(params.s)
  const [section, setSection] = useState(initialSectionId)

  const sectionOptions = sections.map(s => ({ value: s.id, label: s.name }))
  const selectedSection = sectionOptions.find(s => s.value === section)

  const [typePresential, setTypePresential] = useState(!params.t || params.t === 'presencial')
  const [typeOnline, setTypeOnline] = useState(!params.t || params.t === 'online')

  const [onlyFreeSeats, setOnlyFreeSeats] = useState(!!params.ofs)

  useEffect(() => {
    setSection(initialSectionId)
  }, [initialSectionId])

  useEffect(() => {
    setTypePresential(!params.t || params.t === 'presencial')
    setTypeOnline(!params.t || params.t === 'online')
  }, [params.t])

  useEffect(() => {
    setOnlyFreeSeats(!!params.ofs)
  }, [params.ofs])

  useEffect(
    function handleClickOutside() {
      function handler(ev) {
        if (!wrapperRef.current.contains(ev.target)) {
          setOpen(false)
        }
      }

      if (open) {
        document.addEventListener('pointerdown', handler)
      }

      return () => document.removeEventListener('pointerdown', handler)
    },
    [open]
  )

  function apply() {
    let type = null
    if (typeOnline !== typePresential) {
      type = typeOnline ? 'online' : 'presencial'
    }
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        page: 0,
        s: section || undefined,
        t: type || undefined,
        ofs: onlyFreeSeats ? '1' : undefined
      }
    })
  }

  function clear() {
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        page: 0,
        s: undefined,
        t: undefined,
        ofs: undefined
      }
    })
  }

  return (
    <div className="md:relative" ref={wrapperRef}>
      <Button
        small
        hasIcon="only"
        className="relative my-1 mr-2"
        background={open ? 'bg-red-700' : 'bg-red-900 hover:bg-red-700'}
        color="text-white"
        border="border-none"
        onClick={() => setOpen(!open)}>
        <FilterIcon className="md:ml-1" width={20} height={20} />
        <span className="md:inline hidden">Filtros</span>
        {hasFilters && (
          <span className="flex h-2 w-2 absolute -top-1 -right-1 rounded-full bg-red-200"></span>
        )}
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
            background="hover:bg-gray-100 hover:bg-opacity-20"
            color="text-gray-100"
            border="border-none"
            onClick={clear}>
            <span>Limpiar</span>
          </Button>
          <Button
            small
            className="mx-1"
            background="bg-red-100 bg-opacity-30 hover:bg-opacity-40"
            color="text-white"
            border="border-none"
            onClick={apply}>
            <span>Aplicar</span>
          </Button>
        </header>
        <section>
          <label className="inline-flex space-x-1 items-center">
            <input
              type="checkbox"
              className="rounded-sm text-red-500"
              checked={onlyFreeSeats}
              onChange={ev => setOnlyFreeSeats(ev.target.checked)}
            />
            <span>Solo partidas con plazas libres</span>
          </label>
        </section>
        <Select
          label="Seccion"
          noSelectionLabel="Todas"
          className="w-64"
          options={sectionOptions}
          selected={selectedSection}
          onChange={ev => setSection(ev.value)}
        />
        <section>
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
        </section>
      </div>
    </div>
  )
}
