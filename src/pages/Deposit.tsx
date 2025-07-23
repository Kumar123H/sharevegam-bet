import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { Smartphone, CreditCard, Wallet } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const paymentMethods = [
  { id: 'phonepe', name: 'PhonePe', icon: '📱', color: 'bg-purple-600' },
  { id: 'googlepay', name: 'Google Pay', icon: '💳', color: 'bg-blue-600' },
  { id: 'paytm', name: 'Paytm', icon: '💰', color: 'bg-blue-500' },
  { id: 'upi', name: 'UPI', icon: '🏦', color: 'bg-green-600' },
];

const Deposit = () => {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
  };

  const handlePayment = () => {
    if (!selectedMethod || !amount) {
      toast({
        title: "Error",
        description: "Please select payment method and enter amount",
        variant: "destructive"
      });
      return;
    }

    const amountNum = parseFloat(amount);
    if (amountNum < 10 || amountNum > 10000) {
      toast({
        title: "Error",
        description: "Amount must be between ₹10 and ₹10,000",
        variant: "destructive"
      });
      return;
    }

    // Navigate to payment page with selected method and amount
    navigate(`/payment?method=${selectedMethod}&amount=${amount}`);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold neon-text">Deposit Funds</h1>
          <p className="text-muted-foreground">Add money to your wallet</p>
        </div>

        {/* Amount Input */}
        <Card className="game-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wallet className="w-6 h-6 mr-2 text-neon-green" />
              Enter Amount
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Input
                type="number"
                placeholder="Enter amount (₹10 - ₹10,000)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-lg"
                min="10"
                max="10000"
              />
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Minimum: ₹10</span>
              <span>Maximum: ₹10,000</span>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card className="game-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="w-6 h-6 mr-2 text-neon-pink" />
              Select Payment Method
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {paymentMethods.map((method) => (
                <Button
                  key={method.id}
                  variant={selectedMethod === method.id ? 'default' : 'outline'}
                  className={`h-20 flex flex-col space-y-2 ${
                    selectedMethod === method.id ? 'casino-button' : ''
                  }`}
                  onClick={() => handleMethodSelect(method.id)}
                >
                  <span className="text-2xl">{method.icon}</span>
                  <span className="text-sm">{method.name}</span>
                </Button>
              ))}
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
              {[100, 500, 1000, 2000].map((quickAmount) => (
                <Button
                  key={quickAmount}
                  variant="outline"
                  onClick={() => setAmount(quickAmount.toString())}
                  className="casino-button"
                >
                  ₹{quickAmount}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Proceed Button */}
        <Button
          onClick={handlePayment}
          size="lg"
          className="w-full casino-button text-xl py-6"
          disabled={!selectedMethod || !amount}
        >
          Proceed to Payment
        </Button>

        {/* Important Notes */}
        <Card className="game-card border-yellow-500/20">
          <CardContent className="p-4">
            <h3 className="font-bold text-yellow-500 mb-2">Important Notes:</h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Minimum deposit: ₹10</li>
              <li>• Maximum deposit: ₹10,000</li>
              <li>• Funds are added instantly after verification</li>
              <li>• Keep your UTR/Reference number safe</li>
              <li>• Contact support for any payment issues</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Deposit;