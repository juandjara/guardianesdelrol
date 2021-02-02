import Tag from './Tag'

export default function RoleTags({ user }) {
  const role = user?.role
  const isDM = user?.is_narrator
  const tags = []
  if (role === 'superadmin') {
    tags.push(
      <Tag color="green" key="dev">
        dev
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

  return tags
}
