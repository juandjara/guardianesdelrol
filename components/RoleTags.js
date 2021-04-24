import Tag from './Tag'

export default function RoleTags({ user }) {
  const role = user?.role
  const isDM = user?.is_narrator
  const isGuest = user?.email === 'guest'

  const tags = []
  if (role === 'superadmin') {
    tags.push(
      <Tag color="green" key="dev">
        admin+
      </Tag>
    )
  }
  if (role === 'admin') {
    tags.push(<Tag key="admin">admin</Tag>)
  }
  if (isDM) {
    tags.push(
      <Tag key="dm" color="yellow">
        DM
      </Tag>
    )
  }
  if (isGuest) {
    tags.push(
      <Tag key="guest" color="gray">
        Invitado
      </Tag>
    )
  }

  return tags
}
