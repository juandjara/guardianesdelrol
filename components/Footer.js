import Link from 'next/link'
import SocialIcon from './social-icons/SocialIcon'
import IconTwitter from './social-icons/twitter.svg'
import IconTwitch from './social-icons/twitch.svg'
import IconMail from './social-icons/mail.svg'
import IconFacebook from './social-icons/facebook.svg'
import IconInstagram from './social-icons/instagram.svg'

export default function Footer() {
  return (
    <footer className="p-3 container mx-auto flex flex-col md:flex-row md:items-end md:justify-between">
      <p>
        &copy; Asocicacion Guardianes {new Date().getFullYear()}
        {' - '}
        <Link href="/rgpd">
          <a className="text-blue-200">RGPD</a>
        </Link>
        {' - '}
        <Link href="/privacy">
          <a className="text-blue-200">Politica de privacidad</a>
        </Link>
        {' - '}
        <span>
          creado por{' '}
          <a className="text-blue-200" href="https://juandjara.com">
            juandjara
          </a>
        </span>
      </p>
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
  )
}
