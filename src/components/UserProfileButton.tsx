
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { User, LogOut, Settings, Star, ChevronDown } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import AuthModal from './auth/AuthModal';
import { useAuth } from '@/hooks/useAuth';
import { signOut } from '@/services/authService';
import { useNavigate } from 'react-router-dom';

const UserProfileButton = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, loading, refreshUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const { success, error } = await signOut();
    
    if (success) {
      toast({
        title: "Signed out",
        description: "You have been successfully signed out",
      });
      refreshUser();
    } else {
      toast({
        title: "Error",
        description: error || "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Button variant="ghost" className="h-9 w-9 rounded-full p-0" disabled>
        <Avatar className="h-9 w-9">
          <AvatarFallback>...</AvatarFallback>
        </Avatar>
      </Button>
    );
  }

  if (!user) {
    return (
      <>
        <Button 
          onClick={() => setIsAuthModalOpen(true)}
          className="bg-intelliPurple hover:bg-intelliPurple/90"
        >
          Sign In
        </Button>
        
        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)} 
        />
      </>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="p-0 h-9 flex items-center gap-2">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user.avatarUrl || ''} alt={user.username || ''} />
              <AvatarFallback className="bg-intelliPurple text-white">
                {user.username?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-white hidden sm:inline-block">
              {user.username || user.email?.split('@')[0]}
            </span>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-darkCard border-gray-700 text-white">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-gray-700" />
          <DropdownMenuItem 
            className="cursor-pointer hover:bg-dark focus:bg-dark"
            onClick={() => navigate('/profile')}
          >
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="cursor-pointer hover:bg-dark focus:bg-dark"
            onClick={() => navigate('/favorites')}
          >
            <Star className="mr-2 h-4 w-4" />
            <span>Favorites</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="cursor-pointer hover:bg-dark focus:bg-dark"
            onClick={() => navigate('/settings')}
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-gray-700" />
          <DropdownMenuItem 
            className="cursor-pointer hover:bg-dark focus:bg-dark"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  );
};

export default UserProfileButton;
