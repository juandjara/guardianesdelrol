import Avatar from '@/components/Avatar'

function AvatarListItem({ user, count }) {
  return (
    <li key={user.id} className="group relative -ml-2 mb-2">
      <Avatar border="border-gray-200" user={user} size={46} />
      <div className="px-2 transition-opacity duration-300 opacity-0 group-hover:opacity-100 h-0 group-hover:h-auto overflow-hidden absolute -left-1 bottom-full">
        <div className="p-3 bg-white rounded-xl mb-2 w-40 shadow-md">
          <Avatar className="w-16" border="border-gray-200" user={user} size={64} />
          <p className="mt-2 font-medium text-sm">{user.display_name || 'Aventurero sin nombre'}</p>
          {count && (
            <p className="mt-1 text-gray-400 text-sm">
              {count[user.id]} partida{count[user.id] === 1 ? '' : 's'}
            </p>
          )}
        </div>
      </div>
    </li>
  )
}

export default function AvatarList({ className = '', users = [], count, action }) {
  return (
    <ul className={`flex flex-wrap items-center ml-2 ${className}`}>
      {users.map(u => (
        <AvatarListItem key={u.id} user={u} count={count} />
      ))}
      {action}
    </ul>
  )
}