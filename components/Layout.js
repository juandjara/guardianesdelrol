import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import styles from '../styles/Layout.module.css'
import NavLink from './NavLink'
import MobileNavMenu from './MobileNavMenu'
import UserMenu from './UserMenu'

import SocialIcon from './social-icons/SocialIcon'
import IconTwitter from './social-icons/twitter.svg'
import IconTwitch from './social-icons/twitch.svg'
import IconMail from './social-icons/mail.svg'
import IconFacebook from './social-icons/facebook.svg'
import IconInstagram from './social-icons/instagram.svg'

export default function Layout({ children, title = 'Guardianes del Rol' }) {
  return (
    <div className="relative flex flex-col text-white h-screen">
      <Head>
        <meta name="theme-color" content="#c0392b" />
        <meta
          name="description"
          content="Portal para organizar las partidas de rol de la asociación Guardianes de Sevilla"
        />
        <title>{title}</title>
      </Head>
      <div className={styles.bgimage}>
        <Image alt="Dados de rol" src="/img/dice-bg.jpg" layout="fill" objectFit="cover" />
      </div>
      <nav className="flex items-start justify-center">
        <div className="hidden md:flex flex-1 mx-1 space-x-1">
          <NavLink href="/posts">Partidas</NavLink>
          <NavLink href="/catalog">Cat&aacute;logo</NavLink>
          <NavLink href="/challenge">Reta a un narrador</NavLink>
        </div>
        <div className="md:hidden flex-1 relative">
          <MobileNavMenu />
        </div>
        <Link href="/">
          <a className="hover:opacity-75">
            <Image src="/img/rol.png" width={75} height={75} />
          </a>
        </Link>
        <UserMenu />
      </nav>
      {children}
      <footer className="p-3 flex flex-col md:flex-row md:items-end md:justify-between">
        <div className="">
          <p>
            powered by <a href="https://nextjs.org">next.js</a>
          </p>
          <p>
            creado por <a href="https://juandjara.com">juandjara</a>
          </p>
          <p>
            &copy; Asocicacion Guardianes {new Date().getFullYear()}
            {' - '}
            <Link href="/rgpd">RGPD</Link>
            {' - '}
            <Link href="/privacy">Politica de privacidad</Link>
          </p>
        </div>
        <div className="space-x-4 mt-4">
          <SocialIcon
            title="@asoguardianes"
            href="https://twitter.com/asoguardianes"
            icon={IconTwitter}
          />
          <SocialIcon
            title="Guardianes Sevilla"
            href="https://www.facebook.com/Guardianes-Sevilla-758918664213908"
            icon={IconFacebook}
          />
          <SocialIcon
            title="@asoguardianes"
            href="https://instagram.com/asoguardianes"
            icon={IconInstagram}
          />
          <SocialIcon
            title="guardianes_esports"
            href="https://www.twitch.tv/guardianes_esports"
            icon={IconTwitch}
          />
          <SocialIcon
            title="asociacion.guardianes@gmail.com"
            href="mailto:asociacion.guardianes@gmail.com"
            icon={IconMail}
          />
        </div>
      </footer>
    </div>
  )
}
