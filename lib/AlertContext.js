import { createContext, useContext, useState } from 'react'

const AlertContext = createContext({
  alert: null,
  setAlert: () => {}
})

export function useAlert() {
  const context = useContext(AlertContext)
  return context
}

export function AlertProvider({ children }) {
  const [alert, setAlert] = useState(null)
  const context = { alert, setAlert }
  return <AlertContext.Provider value={context}>{children}</AlertContext.Provider>
}
