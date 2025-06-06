"use client";

import { updateUserRole } from "@/actions/admin.actions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { MoreHorizontal, ShieldCheck, User } from "lucide-react";
import { useState } from "react";

type UserType = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export default function UserRoleActions({ user }: { user: UserType }) {
  const [loading, setLoading] = useState(false);

  const changeRole = async (newRole: "user" | "admin") => {
    if (newRole === user.role) return;
    
    setLoading(true);
    try {
      const result = await updateUserRole(user.id, newRole);
      
      if (result.success) {
        toast("Role updated", {
          description: `${user.name}'s role has been updated to ${newRole}.`,
          duration: 3000,
        });
      } else {
        toast("Error", {
          description: result.error || "Failed to update role",
          duration: 3000,
        });
      }
    } catch {
      toast("Error",{
        description: "Something went wrong. Please try again.",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          disabled={loading}
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Change Role</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className={`flex items-center ${user.role === "admin" ? "text-gray-400" : ""}`}
          onClick={() => changeRole("admin")}
          disabled={user.role === "admin" || loading}
        >
          <ShieldCheck className="mr-2 h-4 w-4" />
          Make Admin
        </DropdownMenuItem>
        <DropdownMenuItem
          className={`flex items-center ${user.role === "user" ? "text-gray-400" : ""}`}
          onClick={() => changeRole("user")}
          disabled={user.role === "user" || loading}
        >
          <User className="mr-2 h-4 w-4" />
          Make User
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 