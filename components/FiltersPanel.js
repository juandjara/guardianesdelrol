import Button from './Button'
import CloseIcon from './icons/CloseIcon'

export default function FiltersPanel({ open, setOpen }) {
  if (!open) {
    return null
  }

  return (
    <div className="fixed z-30 inset-0 w-full overflow-hidden flex justify-end items-stretch bg-black bg-opacity-30">
      <div className="shadow-lg max-w-md bg-red-900 h-full w-full">
        <Button
          small
          hasIcon="only"
          color="text-white"
          background="bg-red-700"
          border="border-none"
          className="ml-auto m-2"
          onClick={() => setOpen(false)}>
          <CloseIcon height={20} width={20} />
        </Button>
      </div>
    </div>
  )
}
