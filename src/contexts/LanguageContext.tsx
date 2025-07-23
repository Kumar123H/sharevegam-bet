import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'ta';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const translations = {
  en: {
    // Login/Sign Up
    'welcome': 'Welcome to Share Vegam',
    'email': 'Email',
    'password': 'Password',
    'login': 'Login',
    'signup': 'Sign Up',
    'createAccount': 'Create Account',
    'haveAccount': 'Already have an account?',
    'noAccount': "Don't have an account?",
    
    // Navigation
    'deposit': 'Deposit',
    'withdraw': 'Withdraw',
    'bankDetails': 'Bank Details',
    'profile': 'Profile',
    'aboutUs': 'About Us',
    'dashboard': 'Dashboard',
    'game': 'Game',
    
    // Game
    'bet': 'Bet',
    'up': 'UP',
    'down': 'DOWN',
    'balance': 'Balance',
    'timer': 'Timer',
    'result': 'Result',
    'win': 'Win',
    'lose': 'Lose',
    
    // Common
    'submit': 'Submit',
    'cancel': 'Cancel',
    'amount': 'Amount',
    'close': 'Close',
    'admin': 'Admin',
    'logout': 'Logout'
  },
  ta: {
    // Login/Sign Up
    'welcome': 'ஷேர் வேகத்திற்கு வரவேற்கிறோம்',
    'email': 'மின்னஞ்சல்',
    'password': 'கடவுச்சொல்',
    'login': 'உள்நுழைய',
    'signup': 'பதிவு செய்க',
    'createAccount': 'கணக்கு உருவாக்கு',
    'haveAccount': 'ஏற்கனவே கணக்கு உள்ளதா?',
    'noAccount': 'கணக்கு இல்லையா?',
    
    // Navigation
    'deposit': 'டெபாசிட்',
    'withdraw': 'திரும்பப் பெறு',
    'bankDetails': 'வங்கி விவரங்கள்',
    'profile': 'சுயவிவரம்',
    'aboutUs': 'எங்களைப் பற்றி',
    'dashboard': 'டாஷ்போர்டு',
    'game': 'விளையாட்டு',
    
    // Game
    'bet': 'பணயம்',
    'up': 'மேலே',
    'down': 'கீழே',
    'balance': 'இருப்பு',
    'timer': 'நேரம்',
    'result': 'முடிவு',
    'win': 'வெற்றி',
    'lose': 'தோல்வி',
    
    // Common
    'submit': 'சமர்பிக்கவும்',
    'cancel': 'ரத்து செய்',
    'amount': 'தொகை',
    'close': 'மூடு',
    'admin': 'நிர்வாகி',
    'logout': 'வெளியேறு'
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  const value = {
    language,
    setLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};