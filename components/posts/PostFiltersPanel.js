import useSections from '@/lib/data/useSections'
import { useQueryParams } from '@/lib/useQueryParams'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import Button from '../Button'
import FilterIcon from '../icons/FilterIcon'
import Select from '../Select'
import { addWeeks, startOfWeek, endOfWeek } from 'date-fns'
import es from 'date-fns/locale/es'
import { DEFAULT_RPP } from '@/lib/data/usePosts'

const SORT_OPTIONS = [
  { label: 'Fecha', value: null },
  { label: 'Nombre', value: 'name' },
  { label: 'Narrador', value: 'narrator->display_name' }
]
const SORT_TYPES = [
  { label: 'De mayor a menor', value: null },
  { label: 'De menor a mayor', value: 'asc' }
]

export default function PostFiltersPanel() {
  const router = useRouter()
  const { params } = useQueryParams()
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef(null)
  const hasFilters = Boolean(
    params.t ||
      params.s ||
      params.ofs ||
      params.sd ||
      params.ed ||
      Number(params.rpp || DEFAULT_RPP) !== DEFAULT_RPP ||
      params.sk ||
      params.st
  )

  const { sections } = useSections()
  const initialSectionId = Number(params.s)
  const [section, setSection] = useState(initialSectionId)

  const sectionOptions = sections.map(s => ({ value: s.id, label: s.name }))
  const selectedSection = sectionOptions.find(s => s.value === section)

  const [typePresential, setTypePresential] = useState(!params.t || params.t === 'presencial')
  const [typeOnline, setTypeOnline] = useState(!params.t || params.t === 'online')

  const [onlyFreeSeats, setOnlyFreeSeats] = useState(!!params.ofs)
  const [startDate, setStartDate] = useState(new Date(params.sd))
  const [endDate, setEndDate] = useState(new Date(params.ed))
  const [rpp, setRpp] = useState(params.rpp || DEFAULT_RPP)
  const [sortKey, setSortKey] = useState(params.sk || SORT_OPTIONS[0].value)
  const [sortType, setSortType] = useState(params.st || SORT_TYPES[0].value)

  const selectedSortKey = SORT_OPTIONS.find(s => s.value === sortKey)
  const selectedSortType = SORT_TYPES.find(s => s.value === sortType)

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

  useEffect(() => {
    setStartDate(params.sd)
  }, [params.sd])

  useEffect(() => {
    setEndDate(params.ed)
  }, [params.ed])

  useEffect(() => {
    setRpp(params.rpp || DEFAULT_RPP)
  }, [params.rpp])

  useEffect(() => {
    setSortKey(params.sk || SORT_OPTIONS[0].value)
  }, [params.sk])

  useEffect(() => {
    setSortType(params.st || SORT_TYPES[0].value)
  }, [params.st])

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
        ofs: onlyFreeSeats ? '1' : undefined,
        sd: startDate || undefined,
        ed: endDate || undefined,
        rpp,
        sk: sortKey,
        st: sortType
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
        ofs: undefined,
        sd: undefined,
        ed: undefined,
        rpp: undefined,
        sk: undefined,
        st: undefined
      }
    })
  }

  function selectThisWeek() {
    const newStartDate = startOfWeek(new Date(), { locale: es })
    setStartDate(newStartDate.toJSON().split('T')[0])

    const newEndDate = endOfWeek(new Date(), { locale: es })
    setEndDate(newEndDate.toJSON().split('T')[0])
  }

  function selectNextWeek() {
    const newStartDate = startOfWeek(new Date(), { locale: es })
    setStartDate(addWeeks(newStartDate, 1).toJSON().split('T')[0])

    const newEndDate = endOfWeek(new Date(), { locale: es })
    setEndDate(addWeeks(newEndDate, 1).toJSON().split('T')[0])
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
          <p className="text-sm text-gray-100 mb-1">Fechas</p>
          <div className="bg-red-700 bg-opacity-50 p-2 rounded-md">
            <div className="flex items-center justify-between space-x-2">
              <div className="flex-grow">
                <span className="text-sm">desde</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={ev => setStartDate(ev.target.value)}
                  className="bg-red-200 text-gray-700 block w-full h-10 pl-3 pr-2 text-base placeholder-gray-500 border border-none rounded-md focus:outline-none focus:ring-1 focus:ring-red-700 focus:border-red-700"
                />
              </div>
              <div className="flex-grow">
                <span className="text-sm">hasta</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={ev => setEndDate(ev.target.value)}
                  className="bg-red-200 text-gray-700 block w-full h-10 pl-3 pr-2 text-base placeholder-gray-500 border border-none rounded-md focus:outline-none focus:ring-1 focus:ring-red-700 focus:border-red-700"
                />
              </div>
            </div>
            <div className="flex flex-wrap">
              <Button
                onClick={selectThisWeek}
                border="border-none"
                background="hover:bg-red-200 bg-red-100"
                className="mt-2 mr-2"
                small>
                Esta semana
              </Button>
              <Button
                onClick={selectNextWeek}
                border="border-none"
                background="hover:bg-red-200 bg-red-100"
                className="mt-2 mr-2"
                small>
                La semana que viene
              </Button>
            </div>
          </div>
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
          <p className="text-sm text-gray-100 mb-1">Resultados por p&aacute;gina</p>
          <input
            type="number"
            step="1"
            min="1"
            value={rpp}
            onChange={ev => setRpp(ev.target.value)}
            className="bg-red-200 text-gray-700 block w-full h-10 pl-3 pr-2 text-base placeholder-gray-500 border border-none rounded-md focus:outline-none focus:ring-1 focus:ring-red-700 focus:border-red-700"
          />
        </section>
        <section>
          <p className="text-sm text-gray-100 mb-1">Ordenar por</p>
          <div className="flex space-x-2">
            <Select
              className="flex-grow"
              options={SORT_OPTIONS}
              selected={selectedSortKey}
              onChange={ev => setSortKey(ev.value)}
            />
            <Select
              className="flex-grow"
              options={SORT_TYPES}
              selected={selectedSortType}
              onChange={ev => setSortType(ev.value)}
            />
          </div>
        </section>
        <section className="pt-2">
          <label className="inline-flex space-x-1 items-center">
            <input
              type="checkbox"
              className="rounded-sm text-red-500 border-red-300"
              checked={onlyFreeSeats}
              onChange={ev => setOnlyFreeSeats(ev.target.checked)}
            />
            <span>Solo partidas con plazas libres</span>
          </label>
        </section>
        <section>
          <p className="text-sm text-gray-100 mb-1">Tipo</p>
          <div className="space-x-6">
            <label className="inline-flex space-x-1 items-center">
              <input
                type="checkbox"
                className="rounded-sm text-red-500 border-red-300"
                checked={typeOnline}
                onChange={ev => setTypeOnline(ev.target.checked)}
              />
              <span>Online</span>
            </label>
            <label className="inline-flex space-x-1 items-center">
              <input
                type="checkbox"
                className="rounded-sm text-red-500 border-red-300"
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
