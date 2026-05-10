'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useApiKey } from '@/context/ApiKeyContext';

const ApiKeyBanner: React.FC = () => {
  const { apiKey, setApiKey, hasKey } = useApiKey();
  const pathname = usePathname();
  const [inputValue, setInputValue] = useState(apiKey);
  const [isVisible, setIsVisible] = useState(!hasKey);

  // 둘러보기 페이지 등 API 키가 필요 없는 페이지에서는 배너를 렌더링하지 않음
  if (pathname === '/gallery') {
    return null;
  }


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setApiKey(inputValue.trim());
      setIsVisible(false);
      alert('API 키가 설정되었습니다.');
    }
  };

  if (!isVisible && hasKey) {
    return (
      <div className="banner-minimized">
        <button onClick={() => setIsVisible(true)}>🔑 API 키 수정</button>
        <style jsx>{`
          .banner-minimized {
            position: fixed;
            bottom: var(--spacing-md);
            right: var(--spacing-md);
            z-index: 1000;
          }
          button {
            background-color: var(--bg-surface-elevated);
            color: var(--fg-color);
            padding: var(--spacing-xs) var(--spacing-md);
            border-radius: var(--radius-full);
            font-size: 0.75rem;
            border: 1px solid var(--border-color);
            box-shadow: var(--shadow-md);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="banner-overlay">
      <div className="banner-card animate-fade-in">
        <h3>🔑 Gemini API 키 설정</h3>
        <p>이 서비스는 사용자의 API 키를 사용하여 캔버스를 생성합니다. 키는 서버에 저장되지 않습니다.</p>
        
        <form onSubmit={handleSubmit} className="form">
          <input 
            type="password" 
            placeholder="AI Studio에서 발급받은 API 키를 입력하세요" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            required
          />
          <div className="actions">
            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="link">
              키 발급받기 ↗
            </a>
            <button type="submit" className="btn-primary">설정하기</button>
          </div>
        </form>
        
        {hasKey && <button className="btn-close" onClick={() => setIsVisible(false)}>나중에 변경</button>}
      </div>

      <style jsx>{`
        .banner-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(15, 23, 42, 0.9);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 2000;
          backdrop-filter: blur(4px);
        }
        .banner-card {
          background-color: var(--bg-surface);
          padding: var(--spacing-xl);
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-color);
          max-width: 500px;
          width: 90%;
          box-shadow: var(--shadow-lg);
        }
        h3 { margin-bottom: var(--spacing-sm); }
        p { color: var(--fg-muted); font-size: 0.875rem; margin-bottom: var(--spacing-lg); }
        .form { display: flex; flex-direction: column; gap: var(--spacing-md); }
        .actions { display: flex; justify-content: space-between; align-items: center; }
        .link { font-size: 0.875rem; color: var(--color-trad-light); }
        .btn-primary {
          background-color: var(--color-trad);
          color: white;
          padding: var(--spacing-sm) var(--spacing-xl);
          border-radius: var(--radius-md);
          font-weight: 600;
        }
        .btn-close {
          margin-top: var(--spacing-md);
          font-size: 0.75rem;
          color: var(--fg-muted);
          width: 100%;
        }
      `}</style>
    </div>
  );
};

export default ApiKeyBanner;
