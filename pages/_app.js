import Layout from '@/components/Layout'
import Alert from '@/components/Alert'
import { AlertProvider } from '@/components/AlertContext'
import { UserContextProvider } from '@/lib/auth/UserContext'
import dynamic from 'next/dynamic'
import '../styles/globals.css'

const ProgressBar = dynamic(() => import('@/components/ProgressBar'), { ssr: false })

function App({ Component, pageProps }) {
  return (
    <AlertProvider>
      <UserContextProvider>
        <Layout>
          <ProgressBar />
          <Alert />
          <Component {...pageProps} />
        </Layout>
      </UserContextProvider>
    </AlertProvider>
  )
}

export default App
