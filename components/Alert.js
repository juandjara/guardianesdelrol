import { useAlert } from '@/lib/AlertContext'
import { useEffect } from 'react'
import AlertIcon from './icons/AlertIcon'
import CloseIcon from './icons/CloseIcon'

const DEFAULT_DELAY = 5000

export default function Alert() {
  const { alert, setAlert } = useAlert()
  useEffect(() => {
    let id
    if (alert) {
      id = window.setTimeout(() => setAlert(null), DEFAULT_DELAY)
    }
    return () => window.clearTimeout(id)
  }, [alert, setAlert])

  // taken from here: https://tailwindcomponents.com/component/alert-component-with-tailwind-css
  return (
    alert && (
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3/4 xl:w-2/4 max-w-xl mt-12 p-4 rounded-md bg-red-200 text-base flex items-center">
        <AlertIcon className="text-red-600 w-5 h-5 mr-3" />
        <span className="text-red-800">{alert}</span>
        <button
          onClick={() => setAlert(null)}
          className="absolute top-1 right-1 text-gray-700 hover:bg-gray-50 hover:bg-opacity-50">
          <CloseIcon width={16} height={16} />
        </button>
      </div>
    )
  )
}
