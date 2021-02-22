import Button from './Button'
import CloseIcon from './icons/CloseIcon'
import { Dialog } from '@reach/dialog'
import Select from './Select'
import useSections from '@/lib/data/useSections'
import { useRouter } from 'next/router'
import { useState } from 'react'

function getQueryParam(router, key) {
  return new URLSearchParams(router.asPath.split('?')[1] || '').get(key) || ''
}

export default function FiltersPanel({ open, setOpen }) {
  const router = useRouter()
  const { sections } = useSections()
  const sectionOptions = sections.map(s => ({ value: s.id, label: s.name }))
  const sectionId = getQueryParam(router, 's')
  const initialSection = sectionOptions.find(s => s.value === sectionId)
  const [section, setSection] = useState(initialSection)

  function close() {
    setOpen(false)
  }

  return (
    <Dialog
      className="p-0 m-0 ml-auto h-full w-full max-w-md text-white bg-red-900"
      aria-labelledby="filter-modal-label"
      isOpen={open}
      onDismiss={close}>
      <header className="flex items-center">
        <h2 id="filter-modal-label" className="px-4 text-xl flex-grow font-semibold">
          Filtros
        </h2>
        <Button
          small
          hasIcon="only"
          color="text-white"
          background="hover:bg-red-800"
          border="border-none"
          className="m-2"
          onClick={() => setOpen(false)}>
          <CloseIcon height={20} width={20} />
        </Button>
      </header>
      <div className="py-2 px-4">
        <Select label="Seccion" options={sectionOptions} selected={section} onChange={setSection} />
      </div>
    </Dialog>
  )
}
