import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CreditCard, Building, User, Hash } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface BankDetails {
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
}

const BankDetails = () => {
  const [bankDetails, setBankDetails] = useState<BankDetails>({
    accountHolderName: '',
    accountNumber: '',
    ifscCode: '',
    bankName: ''
  });
  const [loading, setLoading] = useState(false);
  const [hasExistingDetails, setHasExistingDetails] = useState(false);
  
  const { currentUser } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    const fetchBankDetails = async () => {
      if (currentUser) {
        try {
          const bankDoc = await getDoc(doc(db, 'bank_details', currentUser.uid));
          if (bankDoc.exists()) {
            setBankDetails(bankDoc.data() as BankDetails);
            setHasExistingDetails(true);
          }
        } catch (error) {
          console.error('Error fetching bank details:', error);
        }
      }
    };

    fetchBankDetails();
  }, [currentUser]);

  const handleInputChange = (field: keyof BankDetails, value: string) => {
    setBankDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) return;

    // Validate required fields
    if (!bankDetails.accountHolderName || !bankDetails.accountNumber || 
        !bankDetails.ifscCode || !bankDetails.bankName) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Validate IFSC code format (basic validation)
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    if (!ifscRegex.test(bankDetails.ifscCode.toUpperCase())) {
      toast({
        title: "Error",
        description: "Please enter a valid IFSC code",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      await setDoc(doc(db, 'bank_details', currentUser.uid), {
        ...bankDetails,
        userId: currentUser.uid,
        updatedAt: new Date(),
        ifscCode: bankDetails.ifscCode.toUpperCase()
      });

      setHasExistingDetails(true);
      
      toast({
        title: "Success",
        description: hasExistingDetails ? "Bank details updated successfully" : "Bank details saved successfully",
      });

    } catch (error) {
      console.error('Error saving bank details:', error);
      toast({
        title: "Error",
        description: "Failed to save bank details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold neon-text">Bank Details</h1>
          <p className="text-muted-foreground">
            {hasExistingDetails ? 'Update your bank information' : 'Add your bank information for withdrawals'}
          </p>
        </div>

        {/* Bank Details Form */}
        <Card className="game-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="w-6 h-6 mr-2 text-neon-green" />
              {hasExistingDetails ? 'Update Bank Details' : 'Enter Bank Details'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Account Holder Name */}
              <div className="space-y-2">
                <Label htmlFor="accountHolderName" className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Account Holder Name *
                </Label>
                <Input
                  id="accountHolderName"
                  type="text"
                  placeholder="Enter full name as per bank account"
                  value={bankDetails.accountHolderName}
                  onChange={(e) => handleInputChange('accountHolderName', e.target.value)}
                  required
                  className="bg-muted"
                />
              </div>

              {/* Account Number */}
              <div className="space-y-2">
                <Label htmlFor="accountNumber" className="flex items-center">
                  <Hash className="w-4 h-4 mr-2" />
                  Account Number *
                </Label>
                <Input
                  id="accountNumber"
                  type="text"
                  placeholder="Enter your account number"
                  value={bankDetails.accountNumber}
                  onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                  required
                  className="bg-muted"
                />
              </div>

              {/* IFSC Code */}
              <div className="space-y-2">
                <Label htmlFor="ifscCode" className="flex items-center">
                  <Building className="w-4 h-4 mr-2" />
                  IFSC Code *
                </Label>
                <Input
                  id="ifscCode"
                  type="text"
                  placeholder="Enter IFSC code (e.g., SBIN0001234)"
                  value={bankDetails.ifscCode}
                  onChange={(e) => handleInputChange('ifscCode', e.target.value.toUpperCase())}
                  required
                  className="bg-muted"
                  maxLength={11}
                />
              </div>

              {/* Bank Name */}
              <div className="space-y-2">
                <Label htmlFor="bankName" className="flex items-center">
                  <Building className="w-4 h-4 mr-2" />
                  Bank Name *
                </Label>
                <Input
                  id="bankName"
                  type="text"
                  placeholder="Enter your bank name"
                  value={bankDetails.bankName}
                  onChange={(e) => handleInputChange('bankName', e.target.value)}
                  required
                  className="bg-muted"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full casino-button text-xl py-6"
                disabled={loading}
              >
                {loading ? 'Saving...' : hasExistingDetails ? 'Update Bank Details' : 'Save Bank Details'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <Card className="game-card border-green-500/20">
          <CardContent className="p-4">
            <h3 className="font-bold text-green-500 mb-2">🔒 Security Notice:</h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Your bank details are encrypted and stored securely</li>
              <li>• We only use this information for withdrawal processing</li>
              <li>• Double-check all details before saving</li>
              <li>• Contact support if you need to change details urgently</li>
            </ul>
          </CardContent>
        </Card>

        {/* Important Information */}
        <Card className="game-card border-yellow-500/20">
          <CardContent className="p-4">
            <h3 className="font-bold text-yellow-500 mb-2">Important Information:</h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Account holder name must match your registered name</li>
              <li>• IFSC code must be valid and active</li>
              <li>• Only Indian bank accounts are supported</li>
              <li>• Ensure your account accepts online transfers</li>
              <li>• We support all major Indian banks</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BankDetails;