import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { DailyBonus } from '@/components/DailyBonus';
import { toast } from '@/hooks/use-toast';
import { 
  Menu, 
  User, 
  Gamepad2,
  TrendingUp,
  Wallet,
  Gift
} from 'lucide-react';

interface UserData {
  email: string;
  wallet: number;
  avatar: string;
  userId: string;
}

const Dashboard = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [showBonus, setShowBonus] = useState(true);
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'user_details', currentUser.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data() as UserData);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleGameClick = () => {
    navigate('/game');
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <main className="flex-1">
          {/* Header */}
          <header className="h-16 border-b border-border flex items-center justify-between px-4">
            <SidebarTrigger />
            
            {/* Logo */}
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center">
                <span className="text-xl font-bold text-background">SV</span>
              </div>
            </div>

            {/* User Profile */}
            <div className="flex items-center space-x-2">
              <Avatar className="w-10 h-10">
                <AvatarImage src={userData?.avatar} />
                <AvatarFallback>
                  <User className="w-6 h-6" />
                </AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <p className="font-medium">{userData?.email}</p>
                <p className="text-muted-foreground">₹{userData?.wallet || 0}</p>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="p-6 space-y-6">
            {/* Daily Bonus */}
            {showBonus && (
              <DailyBonus onClose={() => setShowBonus(false)} />
            )}

            {/* Welcome Section */}
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold neon-text animate-neon-pulse">
                Welcome to Share Vegam
              </h1>
              <p className="text-xl text-muted-foreground">
                Your Stock Market Casino Experience
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="game-card">
                <CardContent className="p-6 text-center">
                  <Wallet className="w-12 h-12 mx-auto mb-4 text-neon-green" />
                  <h3 className="text-2xl font-bold">₹{userData?.wallet || 0}</h3>
                  <p className="text-muted-foreground">Wallet Balance</p>
                </CardContent>
              </Card>

              <Card className="game-card">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 text-neon-pink" />
                  <h3 className="text-2xl font-bold">₹0</h3>
                  <p className="text-muted-foreground">Today's Profit</p>
                </CardContent>
              </Card>

              <Card className="game-card">
                <CardContent className="p-6 text-center">
                  <Gift className="w-12 h-12 mx-auto mb-4 text-neon-gold" />
                  <h3 className="text-2xl font-bold">Available</h3>
                  <p className="text-muted-foreground">Daily Bonus</p>
                </CardContent>
              </Card>
            </div>

            {/* Game Access */}
            <div className="text-center">
              <Button
                onClick={handleGameClick}
                size="lg"
                className="casino-button text-xl px-12 py-6 animate-glow"
              >
                <Gamepad2 className="w-8 h-8 mr-4" />
                Start Trading Game
              </Button>
            </div>

            {/* Market Status */}
            <Card className="game-card">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 neon-text">Market Status</h3>
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-neon-green">ACTIVE</p>
                    <p className="text-sm text-muted-foreground">Market is open</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">24/7</p>
                    <p className="text-sm text-muted-foreground">Trading Hours</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-neon-pink">₹2x</p>
                    <p className="text-sm text-muted-foreground">Win Multiplier</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;