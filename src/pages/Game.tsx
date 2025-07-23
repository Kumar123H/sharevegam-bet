import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowUp, ArrowDown, Timer, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface GameResult {
  result: 'UP' | 'DOWN' | 'TIE';
  id: string;
}

const Game = () => {
  const [gamePhase, setGamePhase] = useState<'betting' | 'playing' | 'result'>('betting');
  const [timer, setTimer] = useState(10);
  const [upBets, setUpBets] = useState(0);
  const [downBets, setDownBets] = useState(0);
  const [selectedAmount, setSelectedAmount] = useState(10);
  const [currentResult, setCurrentResult] = useState<'UP' | 'DOWN' | 'TIE' | null>(null);
  const [previousResults, setPreviousResults] = useState<GameResult[]>([]);
  const [animationDirection, setAnimationDirection] = useState<'up' | 'down' | 'center'>('center');
  const { t } = useLanguage();

  const betAmounts = [10, 20, 50, 100];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (gamePhase === 'betting' && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (gamePhase === 'betting' && timer === 0) {
      // Start game animation
      setGamePhase('playing');
      setTimer(5);
      
      // Simulate random movement
      const directions = ['up', 'down', 'center'];
      let animationCount = 0;
      const animationInterval = setInterval(() => {
        setAnimationDirection(directions[Math.floor(Math.random() * directions.length)] as any);
        animationCount++;
        
        if (animationCount >= 10) {
          clearInterval(animationInterval);
          // Determine final result
          const finalResult = Math.random() < 0.45 ? 'UP' : Math.random() < 0.9 ? 'DOWN' : 'TIE';
          setCurrentResult(finalResult);
          setAnimationDirection(finalResult === 'UP' ? 'up' : finalResult === 'DOWN' ? 'down' : 'center');
          setGamePhase('result');
          
          // Add to previous results
          setPreviousResults(prev => [
            { result: finalResult, id: Date.now().toString() },
            ...prev.slice(0, 9)
          ]);
        }
      }, 200);
    } else if (gamePhase === 'result' && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (gamePhase === 'result' && timer === 0) {
      // Reset for next round
      setGamePhase('betting');
      setTimer(10);
      setCurrentResult(null);
      setUpBets(0);
      setDownBets(0);
      setAnimationDirection('center');
    }

    return () => clearInterval(interval);
  }, [gamePhase, timer]);

  const placeBet = (direction: 'UP' | 'DOWN') => {
    if (gamePhase !== 'betting') return;
    
    if (direction === 'UP') {
      setUpBets(prev => prev + selectedAmount);
    } else {
      setDownBets(prev => prev + selectedAmount);
    }
  };

  const getResultIcon = (result: 'UP' | 'DOWN' | 'TIE') => {
    switch (result) {
      case 'UP':
        return <TrendingUp className="w-4 h-4 text-neon-green" />;
      case 'DOWN':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      case 'TIE':
        return <Minus className="w-4 h-4 text-yellow-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold neon-text">Share Vegam Trading</h1>
          <p className="text-muted-foreground">Predict the market movement</p>
        </div>

        {/* Game Status */}
        <Card className="game-card">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center space-x-4">
              <Timer className="w-6 h-6" />
              <span className="text-2xl font-bold">
                {timer}s
              </span>
              <span className="text-lg">
                {gamePhase === 'betting' ? 'Betting Time' : 
                 gamePhase === 'playing' ? 'Market Moving...' : 'Result'}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Market Animation */}
        <Card className="game-card">
          <CardContent className="p-8">
            <div className="h-40 flex items-center justify-center relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-1 h-full bg-border"></div>
              </div>
              
              <div 
                className={`text-6xl font-bold transition-all duration-300 ${
                  animationDirection === 'up' ? 'text-neon-green transform -translate-y-8' :
                  animationDirection === 'down' ? 'text-red-500 transform translate-y-8' :
                  'text-yellow-500'
                }`}
              >
                {animationDirection === 'up' ? '📈' : 
                 animationDirection === 'down' ? '📉' : '📊'}
              </div>
            </div>
            
            {currentResult && (
              <div className="text-center mt-4">
                <p className="text-2xl font-bold">
                  Result: <span className={
                    currentResult === 'UP' ? 'text-neon-green' :
                    currentResult === 'DOWN' ? 'text-red-500' : 
                    'text-yellow-500'
                  }>
                    {currentResult}
                  </span>
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Betting Section */}
        {gamePhase === 'betting' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bet Amount Selection */}
            <Card className="game-card">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-4">Select Bet Amount</h3>
                <div className="grid grid-cols-2 gap-2">
                  {betAmounts.map((amount) => (
                    <Button
                      key={amount}
                      variant={selectedAmount === amount ? 'default' : 'outline'}
                      onClick={() => setSelectedAmount(amount)}
                      className="casino-button"
                    >
                      ₹{amount}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Betting Buttons */}
            <Card className="game-card">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-4">Place Your Bet</h3>
                <div className="space-y-3">
                  <Button
                    onClick={() => placeBet('UP')}
                    className="w-full bg-neon-green text-background hover:bg-neon-green/80"
                    size="lg"
                  >
                    <ArrowUp className="w-6 h-6 mr-2" />
                    BET UP (₹{upBets})
                  </Button>
                  
                  <Button
                    onClick={() => placeBet('DOWN')}
                    className="w-full bg-red-500 text-white hover:bg-red-600"
                    size="lg"
                  >
                    <ArrowDown className="w-6 h-6 mr-2" />
                    BET DOWN (₹{downBets})
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Previous Results */}
        <Card className="game-card">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold mb-4">Previous 10 Results</h3>
            <div className="flex space-x-2 overflow-x-auto">
              {previousResults.length === 0 ? (
                <p className="text-muted-foreground">No previous results yet</p>
              ) : (
                previousResults.map((result) => (
                  <div
                    key={result.id}
                    className="flex-shrink-0 w-12 h-12 rounded-full border-2 border-border flex items-center justify-center"
                  >
                    {getResultIcon(result.result)}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Game Rules */}
        <Card className="game-card">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold mb-4">Game Rules</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Place bets during the 10-second betting phase</li>
              <li>• If your prediction is correct, you win 2x your bet amount</li>
              <li>• If market ends in TIE, both sides lose their bets</li>
              <li>• New round starts automatically after results</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Game;