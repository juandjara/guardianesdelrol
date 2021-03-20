import MenuLink from './MenuLink'
import { Menu, Transition } from '@headlessui/react'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/db-client/supabase'
import RoleTags from './RoleTags'
import useProfile from '@/lib/auth/useProfile'
import Avatar from './Avatar'
import Button, { buttonFocusStyle } from './Button'
import Link from 'next/link'

export default function UserMenu() {
  const { user } = useProfile()
  const router = useRouter()

  async function handleLogout(ev) {
    ev.preventDefault()
    await router.push('/')
    await supabase.auth.signOut()
  }

  if (!user) {
    return (
      <div className="flex-1">
        <Link href="/login">
          <a>
            <Button className="block ml-auto mr-2 mt-2">ENTRAR</Button>
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
            <Menu.Button
              title="Open user menu"
              className={`m-2 ml-auto block rounded-full ${buttonFocusStyle}`}>
              <span className="sr-only">Open user menu</span>
              <Avatar user={user} size={44} border="border-white" />
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
                  <p className="mb-1 text-sm font-semibold truncate">{user.displayName}</p>
                  <p className="space-x-1 font-semibold">
                    <RoleTags user={user} />
                  </p>
                </div>
                <Menu.Item>
                  {({ active }) => (
                    <MenuLink active={active} href="/settings">
                      Mi cuenta
                    </MenuLink>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <MenuLink active={active} href="/dashboard#posts">
                      Mis partidas
                    </MenuLink>
                  )}
                </Menu.Item>
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
