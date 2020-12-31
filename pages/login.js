import Button from '@/components/Button'
import Layout from '@/components/Layout'
import IconGoogle from '@/components/social-icons/google.svg'
import { useRouter } from 'next/router'

export default function Login () {
  const router = useRouter()
  const next = router.query.next
  
  return (
    <Layout className="mt-4 px-4 text-center">
      <h1 className="text-6xl font-bold">Iniciar sesi&oacute;n</h1>
      <div className="bg-white text-red-900 rounded-lg mt-8 px-4 py-8 max-w-xl mx-auto flex flex-col">
        {next && (<p className="mb-6">Es necesario iniciar sesión para continuar</p>)}
        <Button hasIcon="left">
          <svg width={20} height={20} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
          <span className="w-40 text-left">Entrar como invitado</span>
        </Button>
        <Button hasIcon="left">
          <svg width={20} height={20} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
          <span className="w-40 text-left">Entrar con tu correo</span>
        </Button>
        <Button hasIcon="left">
          <IconGoogle width={20} height={20} />
          <span className="w-40 text-left">Entrar con Google</span>
        </Button>
      </div>
    </Layout>
  )
}
