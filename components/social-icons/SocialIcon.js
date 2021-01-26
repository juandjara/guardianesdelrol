export default function SocialIcon({ href, title, icon: Icon }) {
  return (
    <a
      title={title}
      aria-label={title}
      href={href}
      target="_blank"
      rel="noreferrer"
      className="hover:opacity-75 inline-block">
      <Icon height={24} width={24} />
    </a>
  )
}
