import React, { createContext, useContext, useState, useCallback } from 'react';

interface AuthModalContextType {
  openLogin: (message?: string) => void;
  closeLogin: () => void;
  isOpen: boolean;
  message: string;
}

const AuthModalContext = createContext<AuthModalContextType>({
  openLogin: () => {},
  closeLogin: () => {},
  isOpen: false,
  message: '',
});

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const openLogin = useCallback((msg = 'Connectez-vous pour continuer') => {
    setMessage(msg);
    setIsOpen(true);
  }, []);

  const closeLogin = useCallback(() => {
    setIsOpen(false);
    setMessage('');
  }, []);

  return (
    <AuthModalContext.Provider value={{ openLogin, closeLogin, isOpen, message }}>
      {children}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  return useContext(AuthModalContext);
}
