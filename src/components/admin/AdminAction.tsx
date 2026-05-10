'use client';

import React, { useState, useEffect } from 'react';

const AdminAction: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const savedPassword = sessionStorage.getItem('admin_password');
    if (savedPassword) {
      setIsAdmin(true);
      setPassword(savedPassword);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim()) {
      setIsAdmin(true);
      sessionStorage.setItem('admin_password', password.trim());
      setIsModalOpen(false);
      alert('관리자 모드가 활성화되었습니다.');
      window.location.reload(); // 상태 반영을 위해 새로고침
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setPassword('');
    sessionStorage.removeItem('admin_password');
    alert('관리자 모드가 해제되었습니다.');
    window.location.reload();
  };

  return (
    <>
      <div className="admin-trigger">
        {isAdmin ? (
          <button onClick={handleLogout} className="btn-logout">🔒 관리자 로그아웃</button>
        ) : (
          <button onClick={() => setIsModalOpen(true)} className="btn-login">🔑 관리자 인증</button>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in">
            <h3>관리자 인증</h3>
            <p>캔버스 및 의견 삭제 권한을 얻으려면 암호를 입력하세요.</p>
            <form onSubmit={handleLogin}>
              <input
                type="password"
                placeholder="관리자 암호 입력"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
              <div className="actions">
                <button type="button" onClick={() => setIsModalOpen(false)}>취소</button>
                <button type="submit" className="btn-primary">인증하기</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .admin-trigger {
          position: fixed;
          bottom: var(--spacing-md);
          left: var(--spacing-md);
          z-index: 1000;
        }
        button {
          padding: var(--spacing-xs) var(--spacing-md);
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 600;
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-sm);
          transition: var(--transition-fast);
        }
        .btn-login { background-color: var(--bg-surface-elevated); color: var(--fg-color); }
        .btn-logout { background-color: var(--color-error); color: white; border: none; }
        
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 3000;
          backdrop-filter: blur(4px);
        }
        .modal-content {
          background-color: var(--bg-surface);
          padding: var(--spacing-xl);
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-color);
          width: 90%;
          max-width: 400px;
        }
        h3 { margin-bottom: var(--spacing-xs); }
        p { color: var(--fg-muted); font-size: 0.875rem; margin-bottom: var(--spacing-lg); }
        input { width: 100%; margin-bottom: var(--spacing-md); }
        .actions { display: flex; justify-content: flex-end; gap: var(--spacing-md); }
        .btn-primary { background-color: var(--color-trad); color: white; }
      `}</style>
    </>
  );
};

export default AdminAction;
