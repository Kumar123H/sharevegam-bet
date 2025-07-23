import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { doc, getDoc, updateDoc, collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Wallet, BanknoteIcon, Clock, CheckCircle, XCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface WithdrawalRequest {
  id: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

const Withdraw = () => {
  const [amount, setAmount] = useState('');
  const [walletBalance, setWalletBalance] = useState(0);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'user_details', currentUser.uid));
          if (userDoc.exists()) {
            setWalletBalance(userDoc.data().wallet || 0);
          }
          
          // Fetch withdrawal history (you would implement this)
          // For now, using mock data
          setWithdrawals([]);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [currentUser]);

  const handleWithdraw = async () => {
    if (!currentUser) return;

    const withdrawAmount = parseFloat(amount);
    
    if (!withdrawAmount || withdrawAmount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive"
      });
      return;
    }

    if (withdrawAmount > walletBalance) {
      toast({
        title: "Error",
        description: "Insufficient balance",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Create withdrawal request
      await addDoc(collection(db, 'withdrawal_requests'), {
        userId: currentUser.uid,
        amount: withdrawAmount,
        status: 'pending',
        createdAt: new Date()
      });

      // Deduct amount from wallet
      await updateDoc(doc(db, 'user_details', currentUser.uid), {
        wallet: walletBalance - withdrawAmount
      });

      setWalletBalance(prev => prev - withdrawAmount);
      setAmount('');
      
      toast({
        title: "Success",
        description: "Withdrawal request submitted successfully",
      });

    } catch (error) {
      console.error('Error processing withdrawal:', error);
      toast({
        title: "Error",
        description: "Failed to process withdrawal request",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold neon-text">Withdraw Funds</h1>
          <p className="text-muted-foreground">Transfer money to your bank account</p>
        </div>

        {/* Wallet Balance */}
        <Card className="game-card">
          <CardContent className="p-6 text-center">
            <Wallet className="w-12 h-12 mx-auto mb-4 text-neon-green" />
            <h3 className="text-2xl font-bold">₹{walletBalance}</h3>
            <p className="text-muted-foreground">Available Balance</p>
          </CardContent>
        </Card>

        {/* Withdrawal Form */}
        <Card className="game-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BanknoteIcon className="w-6 h-6 mr-2 text-neon-pink" />
              Withdraw Amount
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Input
                type="number"
                placeholder="Enter withdrawal amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-lg"
                max={walletBalance}
              />
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Minimum: ₹10</span>
              <span>Available: ₹{walletBalance}</span>
            </div>
          </CardContent>
        </Card>

        {/* Quick Amount Buttons */}
        <Card className="game-card">
          <CardHeader>
            <CardTitle>Quick Select</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-2">
              {[100, 500, 1000, walletBalance].map((quickAmount) => (
                <Button
                  key={quickAmount}
                  variant="outline"
                  onClick={() => setAmount(quickAmount.toString())}
                  className="casino-button"
                  disabled={quickAmount > walletBalance || quickAmount === 0}
                >
                  {quickAmount === walletBalance ? 'All' : `₹${quickAmount}`}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Button
          onClick={handleWithdraw}
          size="lg"
          className="w-full casino-button text-xl py-6"
          disabled={!amount || loading}
        >
          {loading ? 'Processing...' : 'Submit Withdrawal Request'}
        </Button>

        {/* Withdrawal History */}
        <Card className="game-card">
          <CardHeader>
            <CardTitle>Withdrawal History</CardTitle>
          </CardHeader>
          <CardContent>
            {withdrawals.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No withdrawal requests yet
              </p>
            ) : (
              <div className="space-y-3">
                {withdrawals.map((withdrawal) => (
                  <div key={withdrawal.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">₹{withdrawal.amount}</p>
                      <p className="text-sm text-muted-foreground">
                        {withdrawal.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(withdrawal.status)}
                      <span className="text-sm capitalize">{withdrawal.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Important Notes */}
        <Card className="game-card border-yellow-500/20">
          <CardContent className="p-4">
            <h3 className="font-bold text-yellow-500 mb-2">Important Notes:</h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Make sure your bank details are updated</li>
              <li>• Withdrawals are processed within 24 hours</li>
              <li>• Amount is deducted immediately from your wallet</li>
              <li>• Contact support for any withdrawal issues</li>
              <li>• Minimum withdrawal amount: ₹10</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Withdraw;