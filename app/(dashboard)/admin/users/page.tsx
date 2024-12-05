"use client"
import { UserTable } from '@/components/UserTable'
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function UsersPage() {
  const router = useRouter();

  const handleGenerateIdCard = () => {
    router.push('/admin/users/generateId');
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">User Management</h1>
      <Button onClick={handleGenerateIdCard} className="mb-5">
        Generate Employee ID Card
      </Button>
      <UserTable />
    </div>
  )
}