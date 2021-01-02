import Layout from '@/components/Layout'
import { Alert, AlertProvider } from '@/lib/alerts'
import { AuthProvider } from '@/lib/auth'
import '../styles/globals.css'

function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <AlertProvider>
        <Layout>
          <Alert />
          <Component {...pageProps} />
        </Layout>
      </AlertProvider>
    </AuthProvider>
  )
}

export default App
