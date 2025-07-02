import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ChatbotConfig {
  isEnabled: boolean;
  position: 'bottom-right' | 'bottom-left';
  theme: 'primary' | 'secondary' | 'success';
  enabledPages: string[];
  autoOpen: boolean;
  welcomeMessage?: string;
}

interface ChatbotContextType {
  config: ChatbotConfig;
  updateConfig: (newConfig: Partial<ChatbotConfig>) => void;
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
}

const defaultConfig: ChatbotConfig = {
  isEnabled: true,
  position: 'bottom-right',
  theme: 'primary',
  enabledPages: [
    '/tickets',
    '/tickets/new',
    '/tickets/',
    '/dashboard',
    '/profile',
    '/',
    '/admin/dashboard'
  ],
  autoOpen: false,
  welcomeMessage: undefined
};

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

interface ChatbotProviderProps {
  children: React.ReactNode;
  config?: Partial<ChatbotConfig>;
}

export const ChatbotProvider: React.FC<ChatbotProviderProps> = ({ 
  children, 
  config: initialConfig = {} 
}) => {
  const [config, setConfig] = useState<ChatbotConfig>({
    ...defaultConfig,
    ...initialConfig
  });
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  // Determine if chatbot should be visible on current page
  useEffect(() => {
    const shouldShow = config.isEnabled && 
                      isAuthenticated && 
                      config.enabledPages.some(page => 
                        location.pathname === page || 
                        location.pathname.startsWith(page)
                      );
    
    setIsVisible(shouldShow);
  }, [location.pathname, config.isEnabled, config.enabledPages, isAuthenticated]);

  const updateConfig = (newConfig: Partial<ChatbotConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  const contextValue: ChatbotContextType = {
    config,
    updateConfig,
    isVisible,
    setIsVisible
  };

  return (
    <ChatbotContext.Provider value={contextValue}>
      {children}
    </ChatbotContext.Provider>
  );
};

export const useChatbot = (): ChatbotContextType => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
};

export default ChatbotProvider;
