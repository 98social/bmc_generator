'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface ApiKeyContextType {
  apiKey: string;
  setApiKey: (key: string) => void;
  hasKey: boolean;
}

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

export const ApiKeyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apiKey, _setApiKey] = useState<string>('');

  // 컴포넌트 마운트 시 sessionStorage에서 키 복구 (선택 사항, 보안상 권장되지는 않지만 편의성 위해)
  useEffect(() => {
    const savedKey = sessionStorage.getItem('gemini_api_key');
    if (savedKey) {
      _setApiKey(savedKey);
    }
  }, []);

  const setApiKey = (key: string) => {
    _setApiKey(key);
    sessionStorage.setItem('gemini_api_key', key);
  };

  return (
    <ApiKeyContext.Provider value={{ apiKey, setApiKey, hasKey: !!apiKey }}>
      {children}
    </ApiKeyContext.Provider>
  );
};

export const useApiKey = () => {
  const context = useContext(ApiKeyContext);
  if (context === undefined) {
    throw new Error('useApiKey must be used within an ApiKeyProvider');
  }
  return context;
};
