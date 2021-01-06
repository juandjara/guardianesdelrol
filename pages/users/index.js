import UserList from '@/components/users/UserList'

export default function Users() {
  return (
    <main className="flex-auto my-4 px-4">
      <h1 className="text-6xl font-bold text-center">Usuarios</h1>
      <UserList />
    </main>
  )
}
