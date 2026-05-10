'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function GalleryPage() {
  const [canvases, setCanvases] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchCanvases();
  }, [page]);

  const fetchCanvases = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/canvases?page=${page}&limit=12&_t=${Date.now()}`);
      const data = await response.json();
      setCanvases(data.items || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('갤러리 로드 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('이 캔버스를 정말로 삭제하시겠습니까? 관련 의견도 모두 삭제됩니다.')) return;

    const adminPassword = sessionStorage.getItem('admin_password');
    try {
      const response = await fetch(`/api/canvases/${id}`, {
        method: 'DELETE',
        headers: {
          'x-admin-password': adminPassword || ''
        }
      });

      if (response.ok) {
        setCanvases((prev) => prev.filter((c) => c.id !== id));
        alert('삭제되었습니다.');
      } else {
        const err = await response.json();
        alert('삭제 실패: ' + err.error);
      }
    } catch (error) {
      console.error('캔버스 삭제 실패:', error);
    }
  };

  return (
    <div className="container animate-fade-in">
      <header className="header">
        <h1>공개 캔버스 둘러보기</h1>
        <p>다른 조직들의 비즈니스 모델을 살펴보고 서로의 성장을 위한 의견을 나눠보세요.</p>
      </header>

      {isLoading ? (
        <div className="loading">로딩 중...</div>
      ) : (
        <>
          <div className="grid">
            {canvases.map((canvas) => (
              <Link href={`/canvas/${canvas.id}`} key={canvas.id} className="card">
                <div className="card-header">
                  <span className={`tag ${canvas.org_type}`}>{canvas.org_type === 'spo' ? 'SPO' : '일반'}</span>
                  <span className="date">{new Date(canvas.created_at).toLocaleDateString()}</span>
                </div>
                <h3>{canvas.subject}</h3>
                <p className="vision">{canvas.input_data?.vision}</p>
                <div className="card-footer">
                  <span>캔버스 보기 →</span>
                  {sessionStorage.getItem('admin_password') && (
                    <button 
                      className="delete-btn" 
                      onClick={(e) => {
                        e.preventDefault();
                        handleDelete(canvas.id);
                      }}
                    >
                      삭제
                    </button>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {canvases.length === 0 && !isLoading && (
            <div className="empty">아직 생성된 캔버스가 없습니다.</div>
          )}

          <div className="pagination">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>이전</button>
            <span>{page} / {Math.ceil(total / 12) || 1}</span>
            <button disabled={page >= Math.ceil(total / 12)} onClick={() => setPage(p => p + 1)}>다음</button>
          </div>
        </>
      )}

      <style jsx>{`
        .header { margin-bottom: var(--spacing-xl); text-align: center; }
        h1 { font-size: 2.5rem; margin-bottom: var(--spacing-xs); }
        .header p { color: var(--fg-muted); }
        
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: var(--spacing-lg);
        }
        
        .card {
          background-color: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: var(--spacing-lg);
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
          transition: var(--transition-normal);
        }
        .card:hover {
          border-color: var(--color-trad);
          transform: translateY(-5px);
          box-shadow: var(--shadow-lg);
        }
        
        .card-header { display: flex; justify-content: space-between; align-items: center; }
        .tag { font-size: 0.7rem; font-weight: 800; padding: 2px 6px; border-radius: 4px; }
        .tag.spo { background-color: var(--bg-social); color: var(--color-social-light); }
        .tag.general { background-color: var(--bg-trad); color: var(--color-trad-light); }
        .date { font-size: 0.75rem; color: var(--fg-muted); }
        
        h3 { font-size: 1.125rem; }
        .vision {
          font-size: 0.875rem;
          color: var(--fg-muted);
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          flex: 1;
        }
        
        .card-footer { 
          margin-top: var(--spacing-md); 
          font-size: 0.875rem; 
          font-weight: 600; 
          color: var(--color-trad-light);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .delete-btn {
          color: var(--color-error);
          font-size: 0.75rem;
          padding: 2px 8px;
          border: 1px solid var(--color-error);
          border-radius: 4px;
        }
        .delete-btn:hover {
          background-color: var(--color-error);
          color: white;
        }
        
        .loading, .empty { text-align: center; padding: var(--spacing-xl) * 2; color: var(--fg-muted); }
        
        .pagination {
          margin-top: var(--spacing-xl) * 2;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: var(--spacing-lg);
        }
        .pagination button {
          background-color: var(--bg-surface-elevated);
          color: var(--fg-color);
          padding: var(--spacing-xs) var(--spacing-md);
          border-radius: var(--radius-md);
        }
        .pagination button:disabled { opacity: 0.3; cursor: not-allowed; }
      `}</style>
    </div>
  );
}
