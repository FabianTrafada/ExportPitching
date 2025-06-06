"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  userProfileUpdateSchema, 
  UserProfileUpdateFormValues,
  emailUpdateSchema,
  EmailUpdateFormValues
} from "@/lib/validations/settings";
import { UserButton } from "@clerk/nextjs";
import { updateUserProfile, updateUserEmail } from "@/actions/user.actions";
import { toast } from "sonner";
import { MailIcon, UserIcon, Check, Loader2 } from "lucide-react";

interface UserSettingsFormProps {
  initialData: {
    name: string;
    email: string;
    imageUrl: string;
    username?: string;
  };
}

export default function UserSettingsForm({ initialData }: UserSettingsFormProps) {
  const [isProfileSubmitting, setIsProfileSubmitting] = useState(false);
  const [isEmailSubmitting, setIsEmailSubmitting] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);

  // Profile form
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
    reset: resetProfile
  } = useForm<UserProfileUpdateFormValues>({
    resolver: zodResolver(userProfileUpdateSchema),
    defaultValues: {
      name: initialData.name,
      username: initialData.username || "",
    },
  });

  // Email form
  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors },
    reset: resetEmail
  } = useForm<EmailUpdateFormValues>({
    resolver: zodResolver(emailUpdateSchema),
    defaultValues: {
      email: initialData.email,
    },
  });

  // Handle profile update
  const onProfileSubmit = async (data: UserProfileUpdateFormValues) => {
    try {
      setIsProfileSubmitting(true);
      const result = await updateUserProfile(data);
      
      if (result.success) {
        toast.success("Profile updated successfully");
        setIsEditingProfile(false);
        window.location.href = "/dashboard/settings";
      } else {
        toast.error(result.error || "Failed to update profile");
      }
    } catch (error) {
      toast.error("An error occurred while updating your profile");
      console.error(error);
    } finally {
      setIsProfileSubmitting(false);
    }
  };

  // Handle email update
  const onEmailSubmit = async (data: EmailUpdateFormValues) => {
    try {
      setIsEmailSubmitting(true);
      const result = await updateUserEmail(data.email);
      
      if (result.success) {
        toast.success(result.message || "Email updated successfully");
        setIsEditingEmail(false);
        window.location.href = "/dashboard/settings";
      } else {
        toast.error(result.error || "Failed to update email");
      }
    } catch (error) {
      toast.error("An error occurred while updating your email");
      console.error(error);
    } finally {
      setIsEmailSubmitting(false);
    }
  };

  // Cancel profile edit
  const cancelProfileEdit = () => {
    resetProfile({
      name: initialData.name,
      username: initialData.username || "",
    });
    setIsEditingProfile(false);
  };

  // Cancel email edit
  const cancelEmailEdit = () => {
    resetEmail({
      email: initialData.email,
    });
    setIsEditingEmail(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <div className="flex justify-center items-center ml-5 h-16 w-16">
          <UserButton 
            appearance={{
              elements: {
                userButtonAvatarBox: "h-16 w-16",
                userButtonBox: "h-16 w-16",
                userButtonTrigger: "h-16 w-16 focus:outline-none focus:ring-0",
                userButtonAvatarImage: "h-16 w-16",
              },
            }}
          />
        </div>
        <div>
          <h3 className="font-medium">Profile Picture</h3>
          <p className="text-sm text-gray-500">
            Managed by your account provider
          </p>
        </div>
      </div>
      
      {/* Profile Form */}
      <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-md font-medium">Profile Information</h3>
          
          {!isEditingProfile ? (
            <Button 
              type="button"
              variant="outline" 
              size="sm"
              onClick={() => setIsEditingProfile(true)}
            >
              <UserIcon className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button 
                type="button"
                variant="ghost" 
                size="sm"
                onClick={cancelProfileEdit}
                disabled={isProfileSubmitting}
              >
                Cancel
              </Button>
              
              <Button 
                type="submit"
                variant="default"
                size="sm"
                disabled={isProfileSubmitting}
              >
                {isProfileSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Display Name
          </label>
          <Input
            {...registerProfile("name")}
            type="text"
            disabled={!isEditingProfile || isProfileSubmitting}
            className={!isEditingProfile ? "bg-gray-50" : ""}
            placeholder="Your Name"
          />
          {profileErrors.name && (
            <p className="text-red-500 text-xs mt-1">{profileErrors.name.message}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <Input
            {...registerProfile("username")}
            type="text"
            disabled={!isEditingProfile || isProfileSubmitting}
            className={!isEditingProfile ? "bg-gray-50" : ""}
            placeholder="username"
          />
          {profileErrors.username && (
            <p className="text-red-500 text-xs mt-1">{profileErrors.username.message}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Your username is used for your profile URL.
          </p>
        </div>
      </form>
      
      {/* Email Form */}
      <form onSubmit={handleEmailSubmit(onEmailSubmit)} className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-md font-medium">Email Address</h3>
          
          {!isEditingEmail ? (
            <Button 
              type="button"
              variant="outline" 
              size="sm"
              onClick={() => setIsEditingEmail(true)}
            >
              <MailIcon className="h-4 w-4 mr-2" />
              Change Email
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button 
                type="button"
                variant="ghost" 
                size="sm"
                onClick={cancelEmailEdit}
                disabled={isEmailSubmitting}
              >
                Cancel
              </Button>
              
              <Button 
                type="submit"
                variant="default"
                size="sm"
                disabled={isEmailSubmitting}
              >
                {isEmailSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Update Email
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
        
        <div>
          <Input
            {...registerEmail("email")}
            type="email"
            disabled={!isEditingEmail || isEmailSubmitting}
            className={!isEditingEmail ? "bg-gray-50" : ""}
          />
          {emailErrors.email && (
            <p className="text-red-500 text-xs mt-1">{emailErrors.email.message}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            {isEditingEmail 
              ? "You'll need to verify your new email address after changing it."
              : "This is the email address associated with your account."}
          </p>
        </div>
      </form>
    </div>
  );
} 