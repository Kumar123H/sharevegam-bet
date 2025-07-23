import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Globe, Facebook, Youtube, Instagram, Twitter } from 'lucide-react';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [logoClickCount, setLogoClickCount] = useState(0);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const { language, setLanguage, t } = useLanguage();
  const { setIsAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogoClick = () => {
    setLogoClickCount(prev => {
      const newCount = prev + 1;
      if (newCount === 3) {
        setShowAdminLogin(true);
        setTimeout(() => {
          setLogoClickCount(0);
          setShowAdminLogin(false);
        }, 10000);
      }
      return newCount;
    });
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        
        // Create user document
        await setDoc(doc(db, 'user_details', user.uid), {
          email: user.email,
          userId: user.uid,
          wallet: 0,
          createdAt: new Date(),
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`
        });
      }

      toast({
        title: "Success",
        description: isLogin ? "Logged in successfully" : "Account created successfully",
      });

      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (adminUsername === 'admin' && adminPassword === 'admin123') {
      setIsAdmin(true);
      navigate('/admin');
      toast({
        title: "Admin Access",
        description: "Welcome to admin panel",
      });
    } else {
      toast({
        title: "Error",
        description: "Invalid admin credentials",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Language Switcher */}
        <div className="flex justify-center space-x-2">
          <Button
            variant={language === 'en' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setLanguage('en')}
            className="casino-button"
          >
            <Globe className="w-4 h-4 mr-1" />
            English
          </Button>
          <Button
            variant={language === 'ta' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setLanguage('ta')}
            className="casino-button"
          >
            <Globe className="w-4 h-4 mr-1" />
            தமிழ்
          </Button>
        </div>

        {/* Logo */}
        <div className="text-center">
          <div 
            className="inline-block cursor-pointer"
            onClick={handleLogoClick}
          >
            <h1 className="text-6xl font-bold neon-text animate-neon-pulse">
              SV
            </h1>
            <p className="text-xl text-muted-foreground mt-2">Share Vegam</p>
          </div>
        </div>

        {/* Admin Login Modal */}
        {showAdminLogin && (
          <Card className="game-card border-neon-gold">
            <CardHeader>
              <CardTitle className="text-center neon-text">Admin Login</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <Input
                  type="text"
                  placeholder="Username"
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  className="bg-muted"
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="bg-muted"
                />
                <Button type="submit" className="w-full gold-accent">
                  Admin Login
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Main Login Form */}
        {!showAdminLogin && (
          <Card className="game-card">
            <CardHeader>
              <CardTitle className="text-center text-2xl neon-text">
                {t(isLogin ? 'welcome' : 'createAccount')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAuth} className="space-y-4">
                <div>
                  <Input
                    type="email"
                    placeholder={t('email')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-muted"
                  />
                </div>
                <div>
                  <Input
                    type="password"
                    placeholder={t('password')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-muted"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full casino-button" 
                  disabled={loading}
                >
                  {loading ? 'Loading...' : t(isLogin ? 'login' : 'signup')}
                </Button>
              </form>

              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-primary hover:underline"
                >
                  {isLogin ? t('noAccount') : t('haveAccount')}
                </button>
              </div>

              {/* Social Icons */}
              <div className="flex justify-center space-x-4 mt-6">
                <Youtube className="w-8 h-8 text-red-500 hover:animate-bounce cursor-pointer" />
                <Facebook className="w-8 h-8 text-blue-500 hover:animate-bounce cursor-pointer" />
                <Instagram className="w-8 h-8 text-pink-500 hover:animate-bounce cursor-pointer" />
                <Twitter className="w-8 h-8 text-blue-400 hover:animate-bounce cursor-pointer" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>©️ 2025 Share Vegam | About Us | Add Yourself</p>
        </div>
      </div>
    </div>
  );
};

export default Login;