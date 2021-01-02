import { getClassname as getButtonClassname } from './Button'
import MenuLink from './MenuLink'
import MenuIcon from './icons/MenuIcon'
import CloseIcon from './icons/CloseIcon'
import { Menu, Transition } from '@headlessui/react'

export default function MobileNav () {
  return (
    <Menu>
      {({ open }) => (
        <>
          <Menu.Button className={`${getButtonClassname({ outline: true })} pl-2 pr-2`}>
            <span className="sr-only">Mobile nav menu</span>
            {open ? (
              <CloseIcon width={24} height={24} />
            ) : (
              <MenuIcon width={24} height={24} />
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
            <Menu.Items static className="absolute left-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
              <Menu.Item>
                {({ active }) => (
                  <MenuLink active={active} href="/posts">Partidas</MenuLink>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <MenuLink active={active} href="/catalog">Nuestro catalogo</MenuLink>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <MenuLink active={active} href="/challenge">Reta a un master</MenuLink>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu> 
  )
}