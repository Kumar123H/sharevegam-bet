import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { User, Mail, Wallet, Hash, Calendar } from 'lucide-react';

interface UserProfile {
  email: string;
  wallet: number;
  avatar: string;
  userId: string;
  createdAt: any;
}

const Profile = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const { currentUser } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'user_details', currentUser.uid));
          if (userDoc.exists()) {
            setUserProfile(userDoc.data() as UserProfile);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
    };

    fetchUserProfile();
  }, [currentUser]);

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold neon-text">My Profile</h1>
          <p className="text-muted-foreground">Your account information</p>
        </div>

        {/* Profile Card */}
        <Card className="game-card">
          <CardContent className="p-8">
            <div className="flex flex-col items-center space-y-6">
              {/* Avatar */}
              <Avatar className="w-32 h-32">
                <AvatarImage src={userProfile.avatar} />
                <AvatarFallback className="text-4xl">
                  <User className="w-16 h-16" />
                </AvatarFallback>
              </Avatar>

              {/* User Info */}
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold neon-text">
                  {userProfile.email.split('@')[0]}
                </h2>
                <p className="text-muted-foreground">Share Vegam Player</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Details */}
        <Card className="game-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-6 h-6 mr-2 text-neon-green" />
              Account Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Email */}
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{userProfile.email}</p>
                </div>
              </div>
            </div>

            {/* User ID */}
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center space-x-3">
                <Hash className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">User ID</p>
                  <p className="text-sm text-muted-foreground font-mono">
                    {userProfile.userId.slice(0, 8)}...
                  </p>
                </div>
              </div>
            </div>

            {/* Wallet Balance */}
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center space-x-3">
                <Wallet className="w-5 h-5 text-neon-green" />
                <div>
                  <p className="font-medium">Wallet Balance</p>
                  <p className="text-sm text-muted-foreground">Available funds</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-neon-green">₹{userProfile.wallet}</p>
              </div>
            </div>

            {/* Join Date */}
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Member Since</p>
                  <p className="text-sm text-muted-foreground">
                    {userProfile.createdAt?.toDate?.()?.toLocaleDateString() || 'Unknown'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card className="game-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wallet className="w-6 h-6 mr-2 text-neon-pink" />
              Gaming Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-neon-green">₹0</p>
                <p className="text-sm text-muted-foreground">Total Winnings</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-neon-pink">0</p>
                <p className="text-sm text-muted-foreground">Games Played</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-neon-gold">0%</p>
                <p className="text-sm text-muted-foreground">Win Rate</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold">₹0</p>
                <p className="text-sm text-muted-foreground">Total Deposited</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Info */}
        <Card className="game-card border-green-500/20">
          <CardContent className="p-4">
            <h3 className="font-bold text-green-500 mb-2">🔒 Account Security:</h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Your account is protected with Firebase authentication</li>
              <li>• All transactions are encrypted and secure</li>
              <li>• Keep your password safe and don't share with others</li>
              <li>• Contact support for any security concerns</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;