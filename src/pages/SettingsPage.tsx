
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { updatePassword } from '@/services/authService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z.object({
  password: z.string()
    .min(8, { message: 'Password must be at least 8 characters' }),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const SettingsPage = () => {
  const { user, loading } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const handleUpdatePassword = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsUpdating(true);
      
      const { success, error } = await updatePassword(values.password);
      
      if (success) {
        toast({
          title: "Password Updated",
          description: "Your password has been successfully updated",
        });
        form.reset();
      } else {
        toast({
          title: "Error",
          description: error || "Failed to update password",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating password:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-white">Loading settings...</h1>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-white">Account Settings</h1>
        
        <div className="bg-darkCard rounded-xl p-6 shadow-subtle mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Security</h2>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpdatePassword)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="bg-dark border-gray-700 text-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Confirm New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="bg-dark border-gray-700 text-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="bg-intelliPurple hover:bg-intelliPurple/90"
                disabled={isUpdating}
              >
                {isUpdating ? 'Updating...' : 'Update Password'}
              </Button>
            </form>
          </Form>
        </div>
        
        <div className="bg-darkCard rounded-xl p-6 shadow-subtle">
          <h2 className="text-xl font-semibold text-white mb-4">Notification Preferences</h2>
          <p className="text-gray-400 mb-4">Manage your notification settings</p>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="price-alerts" className="text-white">Price Alerts</Label>
              <input
                type="checkbox"
                id="price-alerts"
                className="toggle toggle-primary"
                defaultChecked
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="prediction-alerts" className="text-white">Prediction Alerts</Label>
              <input
                type="checkbox"
                id="prediction-alerts"
                className="toggle toggle-primary"
                defaultChecked
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="email-updates" className="text-white">Email Updates</Label>
              <input
                type="checkbox"
                id="email-updates"
                className="toggle toggle-primary"
              />
            </div>
          </div>
          
          <div className="mt-6">
            <Button className="bg-intelliPurple hover:bg-intelliPurple/90">
              Save Preferences
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
