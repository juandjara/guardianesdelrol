import { DEFAULT_RPP } from '@/lib/users/useUsers'
import { useQueryParams } from '@/lib/useQueryParams'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import Button from '../Button'
import BackIcon from '../icons/BackIcon'
import FilterIcon from '../icons/FilterIcon'
import Select from '../Select'

const SORT_OPTIONS = [
  { label: 'Nombre', value: null },
  { label: 'Rol', value: 'role' }
]
const SORT_TYPES = [
  { label: 'De mayor a menor', value: null },
  { label: 'De menor a mayor', value: 'asc' }
]
const ROLE_OPTIONS = [
  { label: 'Invitado', value: 'guest' },
  { label: 'DM', value: 'dm' },
  { label: 'Admin', value: 'admin' },
  { label: 'Admin+', value: 'superadmin' }
]

function initialFilterState(params) {
  return {
    rpp: params.rpp || DEFAULT_RPP,
    sortKey: params.sk || SORT_OPTIONS[0].value,
    sortType: params.st || SORT_TYPES[0].value,
    role: params.r
  }
}

export default function UserFiltersPanel() {
  const router = useRouter()
  const { params } = useQueryParams()
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef(null)
  const hasFilters = Boolean(
    Number(params.rpp || DEFAULT_RPP) !== DEFAULT_RPP || params.sk || params.st
  )

  const [filters, setFilters] = useState(() => initialFilterState(params))
  const { role, rpp, sortKey, sortType } = filters

  const selectedRole = ROLE_OPTIONS.find(opt => opt.value === role)
  const selectedSortKey = SORT_OPTIONS.find(opt => opt.value === sortKey)
  const selectedSortType = SORT_TYPES.find(opt => opt.value === sortType)

  useEffect(() => {
    setFilters(initialFilterState(params))
  }, [params])

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

  function update(key, value) {
    setFilters(state => ({ ...state, [key]: value }))
  }

  function apply() {
    setOpen(false)
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        page: 0,
        rpp,
        sk: sortKey,
        st: sortType,
        r: role
      }
    })
  }

  function clear() {
    setOpen(false)
    const query = { ...router.query, page: 0 }
    delete query.rpp
    delete query.sk
    delete query.st
    delete query.r

    router.push({ pathname: router.pathname, query })
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
        <FilterIcon width={20} height={20} />
        <span className="md:inline hidden">Filtros</span>
        {hasFilters && (
          <span className="flex h-2 w-2 absolute -top-1 -right-1 rounded-full bg-red-200"></span>
        )}
      </Button>
      <div
        className={`${
          open ? 'scale-x-100 visible' : 'scale-x-0 invisible'
        } space-y-4 rounded-md bg-red-900 bg-opacity-90 z-20 fixed md:absolute top-0 md:top-full right-0 h-full md:h-auto w-full md:w-96 md:mr-2 py-2 px-3 md:origin-right transition-transform`}>
        <header className="flex items-center -mr-2">
          <Button
            small
            hasIcon="only"
            color="text-white"
            background="hover:bg-red-800"
            border="border-none"
            className="mr-2 md:hidden"
            onClick={() => setOpen(false)}>
            <BackIcon height={20} width={20} />
          </Button>
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
          <Select
            label="Rol"
            noSelectionLabel="Todos"
            className="w-64"
            options={ROLE_OPTIONS}
            selected={selectedRole}
            onChange={ev => update('role', ev.value)}
          />
        </section>
        <section>
          <label htmlFor="rpp" className="text-sm text-gray-100 mb-1">
            Resultados por p&aacute;gina
          </label>
          <input
            name="rpp"
            type="number"
            step="1"
            min="1"
            value={rpp}
            onChange={ev => update('rpp', ev.target.value)}
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
              onChange={ev => update('sortKey', ev.value)}
            />
            <Select
              className="flex-grow"
              options={SORT_TYPES}
              selected={selectedSortType}
              onChange={ev => update('sortType', ev.value)}
            />
          </div>
        </section>
      </div>
    </div>
  )
}
