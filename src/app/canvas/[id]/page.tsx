'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import TraditionalBMC from '@/components/canvas/TraditionalBMC';
import SocialBMC from '@/components/canvas/SocialBMC';
import FeedbackPanel from '@/components/feedback/FeedbackPanel';
import CommentSidebar from '@/components/comments/CommentSidebar';

export default function CanvasDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [canvas, setCanvas] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // 사이드바 상태
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState({ key: '', label: '', type: 'traditional' as 'traditional' | 'social' });

  useEffect(() => {
    if (id) fetchCanvas();
  }, [id]);

  const fetchCanvas = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/canvases/${id}`);
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setCanvas(data);
    } catch (err: any) {
      setError(err.message || '캔버스를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
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
        alert('삭제되었습니다.');
        window.location.href = '/gallery';
      } else {
        const err = await response.json();
        alert('삭제 실패: ' + err.error);
      }
    } catch (error) {
      console.error('캔버스 삭제 실패:', error);
    }
  };

  const handleBlockClick = (key: string, label: string, type: 'traditional' | 'social') => {
    setSelectedBlock({ key, label, type });
    setSidebarOpen(true);
  };

  if (isLoading) return <div className="container center">로딩 중...</div>;
  if (error) return <div className="container center error">{error}</div>;

  return (
    <div className="container animate-fade-in">
      <div className="header">
        <div className="info">
          <span className="date">{new Date(canvas.created_at).toLocaleDateString()}</span>
          <h1>{canvas.subject}</h1>
          <p className="vision">{canvas.input_data?.vision}</p>
        </div>
        <div className="meta">
          <span className={`tag ${canvas.org_type}`}>{canvas.org_type === 'spo' ? 'SPO 모델' : '일반 모델'}</span>
          {sessionStorage.getItem('admin_password') && (
            <button className="delete-btn" onClick={handleDelete}>🗑️ 캔버스 전체 삭제</button>
          )}
        </div>
      </div>

      <div className="canvas-wrapper">
        <section>
          <TraditionalBMC 
            data={{ title: '전통적 BMC', blocks: canvas.traditional_data?.blocks || canvas.traditional_data }} 
            onCommentClick={(key, label) => handleBlockClick(key, label, 'traditional')} 
          />
        </section>
        
        <div className="divider" />
        
        <section>
          <SocialBMC 
            data={{ title: '사회적 BMC (SPO용)', blocks: canvas.social_data?.blocks || canvas.social_data }} 
            onCommentClick={(key, label) => handleBlockClick(key, label, 'social')} 
          />
        </section>
      </div>

      {canvas.ai_feedback && <FeedbackPanel feedback={canvas.ai_feedback} />}

      <CommentSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        canvasId={id}
        canvasType={selectedBlock.type}
        blockKey={selectedBlock.key}
        blockLabel={selectedBlock.label}
      />

      <style jsx>{`
        .center { text-align: center; padding: var(--spacing-xl) * 2; }
        .error { color: var(--color-error); }
        
        .header { margin-bottom: var(--spacing-xl) * 2; border-bottom: 1px solid var(--border-color); padding-bottom: var(--spacing-xl); }
        .date { font-size: 0.875rem; color: var(--fg-muted); }
        h1 { font-size: 2.5rem; margin: var(--spacing-xs) 0; }
        .vision { color: var(--fg-muted); font-size: 1.125rem; max-width: 800px; }
        .meta { margin-top: var(--spacing-md); display: flex; justify-content: space-between; align-items: center; }
        .tag { font-size: 0.875rem; font-weight: 700; padding: 4px 12px; border-radius: var(--radius-full); }
        .tag.spo { background-color: var(--bg-social); color: var(--color-social-light); }
        .tag.general { background-color: var(--bg-trad); color: var(--color-trad-light); }
        .delete-btn {
          background-color: var(--color-error);
          color: white;
          padding: var(--spacing-xs) var(--spacing-md);
          border-radius: var(--radius-md);
          font-weight: 600;
          font-size: 0.875rem;
        }
        .delete-btn:hover {
          filter: brightness(1.1);
          transform: translateY(-1px);
        }
        
        .canvas-wrapper { display: flex; flex-direction: column; gap: var(--spacing-xl) * 2; }
        .divider { height: 1px; background: var(--border-color); margin: var(--spacing-xl) 0; position: relative; }
        .divider::after { content: 'VS'; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: var(--bg-color); padding: 0 10px; color: var(--fg-muted); font-weight: 700; }
      `}</style>
    </div>
  );
}
