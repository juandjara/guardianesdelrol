
export default function SocialIcon ({ href, title, icon: Icon }) {
  return (
    <a title={title} href={href} target="_blank" 
       className="hover:opacity-75 inline-block">
      <Icon height={24} width={24} />
    </a>
  )
}
