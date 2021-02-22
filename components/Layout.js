import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import styles from '../styles/Layout.module.css'
import Nav from './Nav'
import UserMenu from './UserMenu'
import Footer from './Footer'

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
        <Image src="/img/dice-bg.jpg" priority layout="fill" objectFit="cover" />
      </div>
      <nav className="flex items-start justify-center">
        <Nav />
        <Link href="/">
          <a className="hover:opacity-75">
            <Image src="/img/rol.png" width={75} height={75} />
          </a>
        </Link>
        <UserMenu />
      </nav>
      {children}
      <Footer />
    </div>
  )
}
