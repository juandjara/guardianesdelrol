import CloseIcon from '@/components/icons/CloseIcon'

const { createContext, useContext, useState, useEffect } = require('react')

const initialContext = {
  alert: null,
  setAlert: () => {}
}

const AlertContext = createContext(initialContext)

export function useAlert() {
  const context = useContext(AlertContext)
  return context
}

const DEFAULT_DELAY = 5000

export function Alert() {
  const { alert, setAlert } = useAlert()
  useEffect(() => {
    let id
    if (alert) {
      id = window.setTimeout(() => setAlert(null), DEFAULT_DELAY)
    }
    return () => window.clearTimeout(id)
  }, [alert, setAlert])

  // take from here: https://tailwindcomponents.com/component/alert-component-with-tailwind-css
  return (
    alert && (
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3/4 xl:w-2/4 max-w-xl mt-12 p-4 rounded-md bg-red-200 text-base flex items-center">
        <svg viewBox="0 0 24 24" className="text-red-600 w-5 h-5 sm:w-5 sm:h-5 mr-3">
          <path
            fill="currentColor"
            d="M11.983,0a12.206,12.206,0,0,0-8.51,3.653A11.8,11.8,0,0,0,0,12.207,11.779,11.779,0,0,0,11.8,24h.214A12.111,12.111,0,0,0,24,11.791h0A11.766,11.766,0,0,0,11.983,0ZM10.5,16.542a1.476,1.476,0,0,1,1.449-1.53h.027a1.527,1.527,0,0,1,1.523,1.47,1.475,1.475,0,0,1-1.449,1.53h-.027A1.529,1.529,0,0,1,10.5,16.542ZM11,12.5v-6a1,1,0,0,1,2,0v6a1,1,0,1,1-2,0Z"></path>
        </svg>
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

export function AlertProvider({ children }) {
  const [alert, setAlert] = useState(null)
  const context = { alert, setAlert }
  return <AlertContext.Provider value={context}>{children}</AlertContext.Provider>
}
