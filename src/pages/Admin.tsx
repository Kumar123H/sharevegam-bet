import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { 
  Users, 
  TrendingUp, 
  TrendingDown, 
  Wallet,
  CheckCircle,
  XCircle,
  DollarSign
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface DepositRequest {
  id: string;
  userId: string;
  amount: number;
  utrNumber: string;
  paymentMethod: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

interface WithdrawalRequest {
  id: string;
  userId: string;
  amount: number;
  bankDetails: any;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

interface GameMatch {
  id: string;
  totalUpBets: number;
  totalDownBets: number;
  result?: 'UP' | 'DOWN' | 'TIE';
  status: 'active' | 'completed';
}

const Admin = () => {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'deposits' | 'withdrawals' | 'game'>('dashboard');
  const [depositRequests, setDepositRequests] = useState<DepositRequest[]>([]);
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([]);
  const [currentMatch, setCurrentMatch] = useState<GameMatch>({
    id: '1',
    totalUpBets: 0,
    totalDownBets: 0,
    status: 'active'
  });

  // Mock data for demo
  const stats = {
    totalUsers: 156,
    todayDeposits: 25000,
    todayWithdrawals: 18000,
    activeGames: 1
  };

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleDepositAction = (requestId: string, action: 'approve' | 'reject') => {
    // Update deposit request status
    setDepositRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, status: action === 'approve' ? 'approved' : 'rejected' }
          : req
      )
    );
    
    toast({
      title: action === 'approve' ? 'Deposit Approved' : 'Deposit Rejected',
      description: `Request ${requestId} has been ${action}d`,
    });
  };

  const handleWithdrawalAction = (requestId: string, action: 'approve' | 'reject') => {
    // Update withdrawal request status
    setWithdrawalRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, status: action === 'approve' ? 'approved' : 'rejected' }
          : req
      )
    );
    
    toast({
      title: action === 'approve' ? 'Withdrawal Approved' : 'Withdrawal Rejected',
      description: `Request ${requestId} has been ${action}d`,
    });
  };

  const handleGameResult = (result: 'UP' | 'DOWN' | 'TIE') => {
    setCurrentMatch(prev => ({
      ...prev,
      result,
      status: 'completed'
    }));
    
    toast({
      title: 'Game Result Set',
      description: `Result set to ${result}`,
    });

    // Reset after 3 seconds for new game
    setTimeout(() => {
      setCurrentMatch({
        id: (parseInt(currentMatch.id) + 1).toString(),
        totalUpBets: 0,
        totalDownBets: 0,
        status: 'active'
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold neon-text">Admin Panel</h1>
          <p className="text-muted-foreground">Share Vegam Management Dashboard</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-2 justify-center">
          {[
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'deposits', label: 'Deposits' },
            { id: 'withdrawals', label: 'Withdrawals' },
            { id: 'game', label: 'Game Control' }
          ].map(tab => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'outline'}
              onClick={() => setActiveTab(tab.id as any)}
              className="casino-button"
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="game-card">
              <CardContent className="p-6 text-center">
                <Users className="w-12 h-12 mx-auto mb-4 text-neon-green" />
                <h3 className="text-2xl font-bold">{stats.totalUsers}</h3>
                <p className="text-muted-foreground">Total Users</p>
              </CardContent>
            </Card>

            <Card className="game-card">
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 text-neon-pink" />
                <h3 className="text-2xl font-bold">₹{stats.todayDeposits.toLocaleString()}</h3>
                <p className="text-muted-foreground">Today's Deposits</p>
              </CardContent>
            </Card>

            <Card className="game-card">
              <CardContent className="p-6 text-center">
                <TrendingDown className="w-12 h-12 mx-auto mb-4 text-neon-gold" />
                <h3 className="text-2xl font-bold">₹{stats.todayWithdrawals.toLocaleString()}</h3>
                <p className="text-muted-foreground">Today's Withdrawals</p>
              </CardContent>
            </Card>

            <Card className="game-card">
              <CardContent className="p-6 text-center">
                <Wallet className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-2xl font-bold">{stats.activeGames}</h3>
                <p className="text-muted-foreground">Active Games</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Deposits Tab */}
        {activeTab === 'deposits' && (
          <Card className="game-card">
            <CardHeader>
              <CardTitle>Deposit Requests</CardTitle>
            </CardHeader>
            <CardContent>
              {depositRequests.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No pending deposit requests
                </p>
              ) : (
                <div className="space-y-4">
                  {depositRequests.map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">₹{request.amount}</p>
                        <p className="text-sm text-muted-foreground">
                          UTR: {request.utrNumber} | Method: {request.paymentMethod}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          User: {request.userId.slice(0, 8)}...
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          className="bg-green-500 hover:bg-green-600"
                          onClick={() => handleDepositAction(request.id, 'approve')}
                          disabled={request.status !== 'pending'}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleDepositAction(request.id, 'reject')}
                          disabled={request.status !== 'pending'}
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Withdrawals Tab */}
        {activeTab === 'withdrawals' && (
          <Card className="game-card">
            <CardHeader>
              <CardTitle>Withdrawal Requests</CardTitle>
            </CardHeader>
            <CardContent>
              {withdrawalRequests.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No pending withdrawal requests
                </p>
              ) : (
                <div className="space-y-4">
                  {withdrawalRequests.map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">₹{request.amount}</p>
                        <p className="text-sm text-muted-foreground">
                          User: {request.userId.slice(0, 8)}...
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Bank details available
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          className="bg-green-500 hover:bg-green-600"
                          onClick={() => handleWithdrawalAction(request.id, 'approve')}
                          disabled={request.status !== 'pending'}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleWithdrawalAction(request.id, 'reject')}
                          disabled={request.status !== 'pending'}
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Game Control Tab */}
        {activeTab === 'game' && (
          <div className="space-y-6">
            <Card className="game-card">
              <CardHeader>
                <CardTitle>Current Match #{currentMatch.id}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-green-500/20 rounded-lg">
                    <p className="text-2xl font-bold text-neon-green">₹{currentMatch.totalUpBets}</p>
                    <p className="text-sm">Total UP Bets</p>
                  </div>
                  <div className="text-center p-4 bg-red-500/20 rounded-lg">
                    <p className="text-2xl font-bold text-red-500">₹{currentMatch.totalDownBets}</p>
                    <p className="text-sm">Total DOWN Bets</p>
                  </div>
                </div>

                {currentMatch.status === 'active' && (
                  <div className="space-y-4">
                    <h3 className="font-bold text-center">Set Game Result</h3>
                    <div className="flex justify-center space-x-4">
                      <Button
                        onClick={() => handleGameResult('UP')}
                        className="bg-green-500 hover:bg-green-600"
                      >
                        UP Wins ✅
                      </Button>
                      <Button
                        onClick={() => handleGameResult('DOWN')}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        DOWN Wins ✅
                      </Button>
                      <Button
                        onClick={() => handleGameResult('TIE')}
                        className="bg-yellow-500 hover:bg-yellow-600"
                      >
                        TIE ❌
                      </Button>
                    </div>
                  </div>
                )}

                {currentMatch.result && (
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-xl font-bold">
                      Result: <span className={
                        currentMatch.result === 'UP' ? 'text-green-500' :
                        currentMatch.result === 'DOWN' ? 'text-red-500' : 
                        'text-yellow-500'
                      }>
                        {currentMatch.result}
                      </span>
                    </p>
                    <p className="text-sm text-muted-foreground">New game starting soon...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;