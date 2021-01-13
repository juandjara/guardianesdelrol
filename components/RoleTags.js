import Tag from './Tag'

export default function RoleTags({ user }) {
  const role = user?.role
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
  // TODO: tag for DM

  return tags
}
