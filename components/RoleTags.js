import Tag from './Tag'

export default function RoleTags({ user }) {
  const role = user?.role
  const tags = []
  if (role === 'admin' || role === 'superadmin') {
    tags.push(<Tag key="admin">admin</Tag>)
  }
  // TODO: tag for DM

  return tags
}
