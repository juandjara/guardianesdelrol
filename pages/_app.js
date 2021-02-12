import Layout from '@/components/Layout'
import Alert from '@/components/Alert'
import { AlertProvider } from '@/lib/AlertContext'
import { UserContextProvider } from '@/lib/auth/UserContext'
import '../styles/globals.css'

function App({ Component, pageProps }) {
  return (
    <AlertProvider>
      <UserContextProvider>
        <Layout>
          <Alert />
          <Component {...pageProps} />
        </Layout>
      </UserContextProvider>
    </AlertProvider>
  )
}

export default App
