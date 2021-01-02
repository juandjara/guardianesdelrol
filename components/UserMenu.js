import Image from 'next/image'
import Link from 'next/link'
import Button, { getClassname as getButtonClassname } from './Button'
import MenuLink from './MenuLink'
import { Menu, Transition } from '@headlessui/react'
import { useAuth } from '@/lib/auth'

export default function UserMenu () {
  const { user, signOut } = useAuth()

  function handleLogout (ev) {
    ev.preventDefault()
    signOut()
  }

  if (!user) {
    return (
      <div className="flex-1 text-right">
        <Link href="/login">
          <a className="inline-block hover:no-underline hover:opacity-75">
            <Button outline className="hover:opacity-100">
              Entrar
            </Button>
          </a>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex-1">
      <Menu>
        {({ open }) => (
          <>
            <Menu.Button className="m-2 ml-auto block border-2 border-white bg-gray-800 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-transparent">
              <span className="sr-only">Open user menu</span>
              <Image width={40} height={40} className="rounded-full" src={user.photoURL} />
            </Menu.Button>
            <Transition
              show={open}
              enter="transition transform duration-200 ease-out"
              enterFrom="scale-y-50 opacity-0"
              enterTo="scale-y-100 opacity-100"
              leave="transition transform duration-200 ease-out"
              leaveFrom="scale-y-100 opacity-100"
              leaveTo="scale-y-50 opacity-0">
              <Menu.Items static className="absolute right-2 w-48 rounded-md shadow-lg py-2 bg-white ring-1 ring-black ring-opacity-5">
                <div className="text-right mb-2 pt-1 pb-3 px-4 text-gray-900 border-b border-1 border-gray-300">
                  <p className="text-xs text-gray-400">Signed in as</p>
                  <p className="text-sm font-medium truncate">{user.displayName}</p>
                </div>
                <Menu.Item>
                  {({ active }) => (
                    <MenuLink active={active} href="/me">Mi cuenta</MenuLink>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <MenuLink active={active} href="/userposts">Mis partidas</MenuLink>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <MenuLink active={active} href="/" onClick={handleLogout}>Cerrar sesión</MenuLink>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </>
        )}
      </Menu>
    </div>
  )
}
