import { getClassname as getButtonClassname } from './Button'
import MenuLink from './MenuLink'
import MenuIcon from './icons/MenuIcon'
import CloseIcon from './icons/CloseIcon'
import { Menu, Transition } from '@headlessui/react'

function TransitionMenuIcon({ as: Component, show }) {
  return (
    <Component
      width={24}
      height={24}
      className={`absolute top-1/2 left-1/2 -mt-3 -ml-3 transition duration-300 transform ${
        show ? '' : 'opacity-0 scale-50'
      }`}
    />
  )
}

export default function MobileNav() {
  return (
    <Menu>
      {({ open }) => (
        <>
          <Menu.Button className={`${getButtonClassname({ outline: true })} relative w-11 h-11`}>
            <span className="sr-only">Mobile nav menu</span>
            <TransitionMenuIcon as={CloseIcon} show={open} />
            <TransitionMenuIcon as={MenuIcon} show={!open} />
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
              className="absolute left-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
              <Menu.Item>
                {({ active }) => (
                  <MenuLink active={active} href="/posts">
                    Partidas
                  </MenuLink>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <MenuLink active={active} href="/catalog">
                    Nuestro catalogo
                  </MenuLink>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <MenuLink active={active} href="/challenge">
                    Reta a un master
                  </MenuLink>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  )
}
