import Image from 'next/image'
import Link from 'next/link'
import Button from './Button'
import MenuLink from './MenuLink'
import { Menu, Transition } from '@headlessui/react'
import UserCircleIcon from './icons/UserCircleIcon'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabase'
import { useSession } from '../lib/UserContext'

export default function UserMenu() {
  const { user } = useSession()
  const router = useRouter()

  async function handleLogout(ev) {
    ev.preventDefault()
    await router.push('/')
    await supabase.auth.signOut()
  }

  if (!user) {
    return (
      <div className="flex-1 text-right">
        <Link href="/login">
          <a className="inline-block hover:no-underline">
            <Button outline className="bg-opacity-50">
              Entrar
            </Button>
          </a>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex-1 z-20">
      <Menu>
        {({ open }) => (
          <>
            <Menu.Button className="w-11 h-11 m-2 ml-auto block border-2 border-white bg-red-900 bg-opacity-50 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-transparent">
              <span className="sr-only">Open user menu</span>
              {user.photoURL ? (
                <Image width={44} height={44} className="rounded-full" src={user.photoURL} />
              ) : (
                <UserCircleIcon className="mx-auto" width={40} height={40} />
              )}
            </Menu.Button>
            <Transition
              show={open}
              enter="transition transform duration-200 ease-out"
              enterFrom="scale-y-50 opacity-0"
              enterTo="scale-y-100 opacity-100"
              leave="transition transform duration-200 ease-out"
              leaveFrom="scale-y-100 opacity-100"
              leaveTo="scale-y-50 opacity-0">
              <Menu.Items
                static
                className="absolute right-2 w-48 rounded-md shadow-lg py-2 bg-white ring-1 ring-black ring-opacity-5">
                <div className="mb-2 pt-1 pb-3 px-4 text-gray-900 border-b border-1 border-gray-300">
                  <p className="text-sm font-semibold truncate">{user.displayName}</p>
                </div>
                <Menu.Item>
                  {({ active }) => (
                    <MenuLink active={active} href="/me">
                      Mi cuenta
                    </MenuLink>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <MenuLink active={active} href="/userposts">
                      Mis partidas
                    </MenuLink>
                  )}
                </Menu.Item>
                {user?.role === 'superadmin' && (
                  <Menu.Item>
                    {({ active }) => (
                      <MenuLink active={active} href="/users">
                        Usuarios
                      </MenuLink>
                    )}
                  </Menu.Item>
                )}
                <Menu.Item>
                  {({ active }) => (
                    <MenuLink active={active} href="/" onClick={handleLogout}>
                      Cerrar sesión
                    </MenuLink>
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
