
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { updateProfile } from '@/services/authService';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Navigate } from 'react-router-dom';
import { getPredictionHistory } from '@/services/aptosService';

const ProfilePage = () => {
  const { user, loading, refreshUser } = useAuth();
  const [username, setUsername] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const [predictions, setPredictions] = useState<any[]>([]);
  const [isPredictionsLoading, setIsPredictionsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setUsername(user.username || '');
      loadPredictions();
    }
  }, [user]);

  const loadPredictions = async () => {
    if (!user) return;
    
    try {
      setIsPredictionsLoading(true);
      
      // In a real implementation, we'd fetch only the user's predictions
      // For now, let's get some sample ones
      const tokenIds = ['aptos', 'btc', 'eth'];
      const results = await Promise.all(
        tokenIds.map(id => getPredictionHistory(id))
      );
      
      // Flatten and take just a few predictions
      const allPredictions = results.flat().slice(0, 5);
      setPredictions(allPredictions);
    } catch (error) {
      console.error("Error loading predictions:", error);
    } finally {
      setIsPredictionsLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSaving(true);
      
      const { success, error } = await updateProfile({
        username
      });
      
      if (success) {
        toast({
          title: "Profile Updated",
          description: "Your profile has been successfully updated",
        });
        refreshUser();
      } else {
        toast({
          title: "Error",
          description: error || "Failed to update profile",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-white">Loading profile...</h1>
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
        <h1 className="text-2xl font-bold mb-6 text-white">Your Profile</h1>
        
        <div className="bg-darkCard rounded-xl p-6 shadow-subtle mb-8">
          <div className="flex items-center mb-6">
            <Avatar className="h-16 w-16 mr-4">
              <AvatarImage src={user.avatarUrl || ''} alt={user.username || ''} />
              <AvatarFallback className="bg-intelliPurple text-xl text-white">
                {user.username?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold text-white">
                {user.username || user.email?.split('@')[0]}
              </h2>
              <p className="text-gray-400">{user.email}</p>
            </div>
          </div>
          
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-white">Username</Label>
              <Input
                id="username"
                placeholder="Your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-dark border-gray-700 text-white"
              />
            </div>
            
            <Button 
              type="submit" 
              className="bg-intelliPurple hover:bg-intelliPurple/90"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </div>
        
        <div className="bg-darkCard rounded-xl p-6 shadow-subtle">
          <h2 className="text-xl font-semibold text-white mb-4">Your Predictions</h2>
          
          {isPredictionsLoading ? (
            <p className="text-gray-400">Loading predictions...</p>
          ) : predictions.length === 0 ? (
            <p className="text-gray-400">You haven't made any predictions yet.</p>
          ) : (
            <div className="space-y-4">
              {predictions.map((prediction, index) => (
                <div key={index} className="bg-dark rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-white">
                      {prediction.tokenId.toUpperCase()} - {prediction.timeframe} Prediction
                    </span>
                    <span className={`text-sm ${prediction.predictedChange > 0 ? 'text-tokenGreen' : 'text-tokenRed'}`}>
                      {prediction.predictedChange > 0 ? '+' : ''}{prediction.predictedChange.toFixed(2)}%
                    </span>
                  </div>
                  <div className="text-sm text-gray-400">
                    <div className="flex justify-between mb-1">
                      <span>Price prediction:</span>
                      <span className="text-white">${prediction.predictedPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Confidence:</span>
                      <span className="text-white">{prediction.confidence.toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
