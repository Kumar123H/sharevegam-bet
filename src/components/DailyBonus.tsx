import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Gift } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface DailyBonusProps {
  onClose: () => void;
}

const bonusTiers = [5, 10, 15, 20, 25, 30, 40];

export const DailyBonus: React.FC<DailyBonusProps> = ({ onClose }) => {
  const [claimed, setClaimed] = useState(false);
  const [selectedBonus, setSelectedBonus] = useState<number | null>(null);
  const { t } = useLanguage();

  const handleClaim = (amount: number) => {
    setSelectedBonus(amount);
    setClaimed(true);
    // Here you would update the user's wallet in Firebase
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="game-card max-w-md w-full animate-scale-in">
        <CardHeader className="text-center relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute right-2 top-2"
          >
            <X className="w-4 h-4" />
          </Button>
          <CardTitle className="text-2xl neon-text flex items-center justify-center">
            <Gift className="w-8 h-8 mr-2 text-neon-gold" />
            Daily Bonus
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!claimed ? (
            <>
              <p className="text-center text-muted-foreground">
                Choose your daily bonus amount!
              </p>
              <div className="grid grid-cols-3 gap-2">
                {bonusTiers.map((amount) => (
                  <Button
                    key={amount}
                    onClick={() => handleClaim(amount)}
                    className="casino-button hover:animate-glow"
                    variant="outline"
                  >
                    ₹{amount}
                  </Button>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center space-y-4">
              <div className="text-6xl animate-bounce">🎉</div>
              <h3 className="text-2xl font-bold neon-text">
                Bonus Claimed!
              </h3>
              <p className="text-xl">
                You received ₹{selectedBonus}
              </p>
              <p className="text-sm text-muted-foreground">
                Come back tomorrow for another bonus!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};