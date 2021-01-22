import { Transition } from '@headlessui/react'
import Button from '@/components/Button'
import { useRouter } from 'next/router'

export default function MailSentScreen() {
  const router = useRouter()
  const emailDomain = router.query.to
  const action = router.query.action

  let actionLabel = ''
  if (action === 'login') {
    actionLabel = 'completar el inicio de sesión'
  }
  if (action === 'recovery') {
    actionLabel = 'recuperar tu contraseña'
  }

  return (
    <main className="flex-auto mt-4 px-4 text-center">
      <h1 className="text-6xl font-bold">Iniciar sesi&oacute;n</h1>
      <div className="bg-white text-gray-700 rounded-lg mt-8 px-4 py-8 max-w-xl mx-auto flex flex-col">
        <div className="space-y-4 flex flex-col items-center justify-center">
          <Transition
            show={true}
            appear={true}
            enter="transition transform duration-500"
            enterFrom="-translate-y-16 scale-150 opacity-0"
            enterTo="-translate-y-0 scale-100 opacity-100">
            <div className="mx-auto rounded-full w-16 h-16 bg-gray-200 flex items-center justify-center">
              <svg
                height={24}
                width={24}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76"
                />
              </svg>
            </div>
          </Transition>
          <p className="text-xl font-medium">Tienes un e-mail!</p>
          <p className="text-base max-w-lg">
            Comprueba tu bandeja de entrada para encontrar el enlace que te hemos enviado y{' '}
            {actionLabel}.
          </p>
          <a className="hover:no-underline" href={`http://${emailDomain}`} rel="noopener">
            <Button
              className="shadow-md border-none"
              color="text-white"
              background="bg-red-500 hover:bg-red-700">
              Ir a {emailDomain}
            </Button>
          </a>
        </div>
      </div>
    </main>
  )
}
