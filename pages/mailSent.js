import { Transition } from '@headlessui/react'
import Button from '@/components/Button'
import { useRouter } from 'next/router'
import Image from 'next/image'

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
    <main className="flex flex-col items-center justify-center flex-auto my-4 px-3">
      <div className="flex md:h-full justify-between bg-white text-gray-700 rounded-lg">
        <div className="bg-gray-100 rounded-l-lg px-4 hidden md:flex flex-col justify-center">
          <Image
            width={346}
            height={400}
            alt="dibujo de bandeja de entrada"
            className="opacity-75"
            priority
            src="/img/illustration_email.png"
          />
        </div>
        <div className="max-w-md flex flex-col justify-center text-left md:px-6 px-4 py-4">
          <Transition
            show={true}
            appear={true}
            enter="transition transform duration-500"
            enterFrom="-translate-y-16 opacity-0"
            enterTo="-translate-y-0 opacity-100">
            <div className="rounded-full w-16 h-16 bg-gray-200 flex items-center justify-center">
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
          <p className="my-4 text-xl font-medium">Tienes un e-mail!</p>
          <p className="mb-4 text-base">
            Comprueba tu bandeja de entrada para encontrar el enlace que te hemos enviado y{' '}
            {actionLabel}.
          </p>
          <a className="hover:no-underline" href={`http://${emailDomain}`} rel="noopener">
            <Button
              className="my-2 shadow-md border-none"
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
