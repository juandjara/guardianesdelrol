import Button from '@/components/Button'
import MailIcon from '@/components/icons/MailIcon'
import UserIcon from '@/components/icons/UserIcon'
import AnonLoginForm from '@/components/login/AnonLoginForm'
import IconGoogle from '@/components/social-icons/google.svg'
import { useAuth } from '@/lib/auth'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function Login() {
  const router = useRouter()
  const next = router.query.next
  const { user, googleSignIn, anonSignIn } = useAuth()

  const [formToShow, setFormToShow] = useState(null)

  useEffect(
    function redirectIfLoggedIn() {
      if (user) {
        router.replace(next || '/')
      }
    },
    [user, router, next]
  )

  function handleCancel() {
    setFormToShow(null)
  }

  function handleAnonLogin(name) {
    anonSignIn(name)
  }

  return (
    <main className="flex-auto mt-4 px-4 text-center">
      <h1 className="text-6xl font-bold">Iniciar sesi&oacute;n</h1>
      <div className="bg-white text-gray-700 rounded-lg mt-8 px-4 py-8 max-w-xl mx-auto flex flex-col">
        {formToShow === 'anon' && (
          <AnonLoginForm onSubmit={handleAnonLogin} onCancel={handleCancel} />
        )}
        {!formToShow && (
          <>
            {next && (
              <p className="text-red-900 mb-2">Es necesario iniciar sesión para continuar</p>
            )}
            <Button
              onClick={googleSignIn}
              hasIcon="left"
              color="text-white"
              background="bg-red-500 hover:bg-red-400"
              border="border-none">
              <IconGoogle width={20} height={20} />
              <span className="w-40 text-left">Entrar con Google</span>
            </Button>
            <Button
              hasIcon="left"
              color="text-white"
              background="bg-gray-900 hover:bg-gray-700"
              border="border-none">
              <MailIcon width={20} height={20} />
              <span className="w-40 text-left">Entrar con tu correo</span>
            </Button>
            <Button
              onClick={() => setFormToShow('anon')}
              hasIcon="left"
              color="text-gray-700"
              background="bg-white hover:bg-gray-100"
              border="border-gray-200">
              <UserIcon width={20} height={20} />
              <span className="w-40 text-left">Entrar como invitado</span>
            </Button>
          </>
        )}
      </div>
    </main>
  )
}
