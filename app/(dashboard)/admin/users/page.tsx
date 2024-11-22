import { UserTable } from '@/components/UserTable'

export default function UsersPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">User Management</h1>
      <UserTable />
    </div>
  )
}