"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteUserAccount } from "@/actions/user.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";


export default function DeleteAccountDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      const result = await deleteUserAccount();
      
      if (result.success) {
        toast.success("Your account has been deleted");
        
        // Close dialog first
        setIsOpen(false);
        
        // Short timeout to allow the dialog to close and toast to show
        setTimeout(() => {
          // Redirect to home page and force a refresh
          router.push("/");
          router.refresh(); // Force Next.js to revalidate and refresh the page
          window.location.href = "/"; // Fallback for a complete refresh if needed
        }, 500);
      } else {
        toast.error(result.error || "Failed to delete account");
        setIsDeleting(false);
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("An unexpected error occurred");
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full px-4 py-2 border border-red-500 text-red-500 hover:bg-red-50 hover:text-red-500 rounded-md transition-colors"
        >
          Delete My Account
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-red-500">Delete Account</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-gray-500">
            By deleting your account, you will lose:
          </p>
          <ul className="list-disc list-inside text-sm text-gray-500 mt-2">
            <li>Access to all your practice sessions</li>
            <li>Your feedback history</li>
            <li>Any remaining credits</li>
            <li>Your custom templates</li>
          </ul>
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setIsOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
            onClick={handleDeleteAccount}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete My Account"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 