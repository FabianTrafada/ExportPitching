"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { updateNotificationPreferences } from "@/actions/user.actions";
import { toast } from "sonner";
import { NotificationSettingsFormProps } from "@/types/type";

export default function NotificationSettingsForm({ initialPreferences }: NotificationSettingsFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(initialPreferences.emailNotifications);
  const [feedbackAlerts, setFeedbackAlerts] = useState(initialPreferences.feedbackAlerts);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      const result = await updateNotificationPreferences({
        emailNotifications,
        feedbackAlerts,
      });
      
      if (result.success) {
        toast.success("Notification preferences saved!");
      } else {
        toast.error(result.error || "Something went wrong");
      }
    } catch (error) {
      toast.error("Failed to update notification preferences");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">Email Notifications</h3>
          <p className="text-sm text-gray-500">Receive updates via email</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            className="sr-only peer"
            checked={emailNotifications}
            onChange={() => setEmailNotifications(!emailNotifications)}
          />
          <div 
            className={`w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${emailNotifications ? 'bg-yellow-400' : ''}`}
          ></div>
        </label>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">Feedback Alerts</h3>
          <p className="text-sm text-gray-500">Get notified when you receive feedback</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            className="sr-only peer"
            checked={feedbackAlerts}
            onChange={() => setFeedbackAlerts(!feedbackAlerts)}
          />
          <div 
            className={`w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${feedbackAlerts ? 'bg-yellow-400' : ''}`}
          ></div>
        </label>
      </div>
      
      <Button
        type="submit"
        className="mt-4 w-full bg-yellow-400 hover:bg-yellow-500 text-white"
        disabled={isLoading}
      >
        {isLoading ? "Saving..." : "Save Preferences"}
      </Button>
    </form>
  );
} 