import Layout from '@/components/Layout'
import { AuthProvider } from '@/lib/auth'
import '../styles/globals.css'

function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  )
}

export default App
