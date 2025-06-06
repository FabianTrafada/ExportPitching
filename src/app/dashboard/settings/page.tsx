import { Suspense } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import UserSettingsForm from "@/components/settings/UserSettingsForm";
import NotificationSettingsForm from "@/components/settings/NotificationSettingsForm";
import DeleteAccountDialog from "@/components/settings/DeleteAccountDialog";
import { 
  getCurrentUserWithClerk, 
  getUserNotificationPreferences,
  createUserIfNotExists 
} from "@/actions/user.actions";
import { redirect } from 'next/navigation';

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  // Ensure the user exists in our database
  await createUserIfNotExists();
  
  const userData = await getCurrentUserWithClerk();
  
  if (!userData) {
    redirect('/sign-in');
  }
  
  const { dbUser, clerkUser } = userData;
  const notificationPrefs = await getUserNotificationPreferences();
  
  return (
    <div className="dashboard-content transition-all duration-300 pt-12 md:pt-0">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">Settings</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
            
            <Suspense fallback={<Skeleton className="h-48 w-full" />}>
              <UserSettingsForm initialData={{
                name: dbUser?.name || '',
                email: clerkUser.emailAddresses[0]?.emailAddress || '',
                imageUrl: dbUser?.imageUrl || clerkUser.imageUrl || '',
                username: clerkUser.username || '',
              }} />
            </Suspense>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
            
            <Suspense fallback={<Skeleton className="h-48 w-full" />}>
              <NotificationSettingsForm 
                initialPreferences={{
                  emailNotifications: notificationPrefs?.emailNotifications ?? true,
                  feedbackAlerts: notificationPrefs?.feedbackAlerts ?? true,
                }}
              />
            </Suspense>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Credits</h2>
            
            <Suspense fallback={<Skeleton className="h-20 w-full" />}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Available Credits</h3>
                    <p className="text-sm text-gray-500">Used to generate AI feedback</p>
                  </div>
                  <span className="text-2xl font-bold text-yellow-500">{dbUser?.credit || 0}</span>
                </div>
                
                <a 
                  href="/pricing" 
                  className="block w-full text-center px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded-md transition-colors"
                >
                  Buy More Credits
                </a>
              </div>
            </Suspense>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Privacy</h2>
            
            <Suspense fallback={<Skeleton className="h-20 w-full" />}>
              <div className="space-y-4">
                <p className="text-gray-600">
                  We take your privacy seriously. You have the right to request deletion of your data.
                </p>
                
                <DeleteAccountDialog />
              </div>
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
} 