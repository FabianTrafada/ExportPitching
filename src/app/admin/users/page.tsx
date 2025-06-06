import { getAllUsers } from "@/actions/admin.actions";
import UserRoleActions from "@/components/admin/UserRoleActions";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { Search, UserCircle } from "lucide-react";
import Image from "next/image";

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function AdminUsersPage({
  searchParams,
}: PageProps) {
  const { page } = await searchParams;
  const currentPage = page ? parseInt(page) : 1;
  const { users, totalCount, totalPages } = await getAllUsers(currentPage, 10);

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">User Management</h1>
        
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search users..." 
              className="pl-9 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">All Users ({totalCount})</h2>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {user.imageUrl ? (
                        <Image
                          src={user.imageUrl} 
                          alt={user.name} 
                          width={8}
                          height={8}
                          className="h-8 w-8 rounded-full object-cover" 
                        />
                      ) : (
                        <UserCircle className="h-8 w-8 text-gray-400" />
                      )}
                      <span>{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span 
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell>
                    {user.createdAt ? formatDistanceToNow(new Date(user.createdAt), { addSuffix: true }) : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right">
                    <UserRoleActions user={user} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-200 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                disabled={currentPage === 1} 
                onClick={() => {}}
                asChild
              >
                <a href={`/admin/users?page=${currentPage - 1}`}>
                  Previous
                </a>
              </Button>
              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => {}}
                asChild
              >
                <a href={`/admin/users?page=${currentPage + 1}`}>
                  Next
                </a>
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
} 