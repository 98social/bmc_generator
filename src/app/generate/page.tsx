'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApiKey } from '@/context/ApiKeyContext';
import { getSessionId } from '@/lib/session';
import TraditionalBMC from '@/components/canvas/TraditionalBMC';
import SocialBMC from '@/components/canvas/SocialBMC';
import FeedbackPanel from '@/components/feedback/FeedbackPanel';
import CommentSidebar from '@/components/comments/CommentSidebar';

export default function GeneratePage() {
  const router = useRouter();
  const { apiKey, hasKey } = useApiKey();
  const [inputData, setInputData] = useState<any>(null);
  const [bmcData, setBmcData] = useState<any>(null);
  const [feedback, setFeedback] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);
  const [error, setError] = useState('');
  
  // 사이드바 상태
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState({ key: '', label: '', type: 'traditional' as 'traditional' | 'social' });
  
  // 저장된 캔버스 ID (저장 후 설정)
  const [savedCanvasId, setSavedCanvasId] = useState<string | null>(null);
  
  // 뷰 모드 상태 (stacked / side-by-side)
  const [viewMode, setViewMode] = useState<'stacked' | 'side'>('stacked');

  useEffect(() => {
    const saved = sessionStorage.getItem('current_input_data');
    if (!saved || !hasKey) {
      router.push('/');
      return;
    }
    const data = JSON.parse(saved);
    setInputData(data);
    generateBMC(data);
  }, []);

  const generateBMC = async (data: any) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey,
          ...data
        })
      });

      const result = await response.json();
      if (result.error) throw new Error(result.error);
      
      setBmcData(result);
      
      // 생성 직후 자동 저장
      saveCanvas(data, result);
    } catch (err: any) {
      setError(err.message || '캔버스 생성 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const saveCanvas = async (input: any, bmc: any) => {
    try {
      const response = await fetch('/api/canvases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: getSessionId(),
          subject: input.subject,
          org_type: input.org_type,
          input_data: input,
          traditional_data: bmc.traditional_bmc,
          social_data: bmc.social_bmc
        })
      });
      const data = await response.json();
      if (data.id) setSavedCanvasId(data.id);
    } catch (err) {
      console.error('캔버스 저장 실패:', err);
    }
  };

  const getFeedback = async () => {
    if (!hasKey || !bmcData) return;
    
    setIsFeedbackLoading(true);
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey,
          traditional_bmc: bmcData.traditional_bmc,
          social_bmc: bmcData.social_bmc
        })
      });
      const result = await response.json();
      if (result.error) throw new Error(result.error);
      
      setFeedback(result.ai_feedback);
      
      // 피드백 데이터 업데이트 저장
      if (savedCanvasId) {
        // 실제로는 별도의 UPDATE API가 필요하거나, 저장 시점에 같이 처리해야 함
        // 여기서는 간단히 메모리에만 유지하거나 추후 확장 가능
      }
    } catch (err: any) {
      alert('피드백 생성 오류: ' + err.message);
    } finally {
      setIsFeedbackLoading(false);
    }
  };

  const handleBlockClick = (key: string, label: string, type: 'traditional' | 'social') => {
    setSelectedBlock({ key, label, type });
    setSidebarOpen(true);
  };

  if (isLoading) {
    return (
      <div className="container loading-view">
        <div className="spinner"></div>
        <h2>AI가 비즈니스 모델을 분석 중입니다...</h2>
        <p>전통적 BMC와 사회적 BMC를 동시에 구성하고 있습니다. 잠시만 기다려주세요.</p>
        <style jsx>{`
          .loading-view { text-align: center; padding: var(--spacing-xl) * 2; }
          .spinner { 
            width: 50px; height: 50px; border: 4px solid var(--bg-surface-elevated); 
            border-top: 4px solid var(--color-trad); border-radius: 50%; 
            animation: spin 1s linear infinite; margin: 0 auto var(--spacing-xl);
          }
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container error-view">
        <h2>❌ 오류 발생</h2>
        <p>{error}</p>
        <button onClick={() => router.push('/')} className="btn-retry">다시 시도하기</button>
        <style jsx>{`
          .error-view { text-align: center; padding: var(--spacing-xl); }
          .btn-retry { margin-top: var(--spacing-md); background: var(--color-trad); color: white; padding: var(--spacing-sm) var(--spacing-xl); border-radius: var(--radius-md); }
        `}</style>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in">
      <div className="toolbar">
        <div className="info">
          <h1>{inputData?.subject}</h1>
          <span className="badge">{inputData?.org_type === 'spo' ? 'SPO 모델' : '일반 모델'}</span>
        </div>
        <div className="actions">
          <button className="btn-toggle" onClick={() => setViewMode(v => v === 'stacked' ? 'side' : 'stacked')}>
            {viewMode === 'stacked' ? '↔️ 나란히 비교하기' : '↕️ 세로로 보기'}
          </button>
          {!feedback && (
            <button className="btn-feedback" onClick={getFeedback} disabled={isFeedbackLoading}>
              {isFeedbackLoading ? '피드백 분석 중...' : '✨ AI 피드백'}
            </button>
          )}
          <button className="btn-share" onClick={() => {
            navigator.clipboard.writeText(window.location.origin + '/canvas/' + savedCanvasId);
            alert('공유 링크가 복사되었습니다!');
          }}>🔗 공유</button>
        </div>
      </div>

      <div className={`canvas-wrapper ${viewMode}`}>
        <section className="canvas-section">
          <TraditionalBMC 
            data={bmcData?.traditional_bmc} 
            onCommentClick={(key, label) => handleBlockClick(key, label, 'traditional')} 
          />
        </section>
        
        {viewMode === 'stacked' && <div className="divider" />}
        
        <section className="canvas-section">
          <SocialBMC 
            data={bmcData?.social_bmc} 
            onCommentClick={(key, label) => handleBlockClick(key, label, 'social')} 
          />
        </section>
      </div>

      {feedback && <FeedbackPanel feedback={feedback} />}

      <CommentSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        canvasId={savedCanvasId || ''}
        canvasType={selectedBlock.type}
        blockKey={selectedBlock.key}
        blockLabel={selectedBlock.label}
      />

      <style jsx>{`
        .toolbar {
          display: flex; justify-content: space-between; align-items: flex-end;
          margin-bottom: var(--spacing-xl); padding-bottom: var(--spacing-md);
          border-bottom: 1px solid var(--border-color);
        }
        .info h1 { font-size: 2rem; }
        .badge { font-size: 0.75rem; background: var(--bg-surface-elevated); padding: 2px 8px; border-radius: var(--radius-full); color: var(--fg-muted); }
        .actions { display: flex; gap: var(--spacing-md); }
        
        .btn-feedback { background: var(--color-social); color: white; padding: var(--spacing-sm) var(--spacing-md); border-radius: var(--radius-md); font-weight: 600; }
        .btn-share { background: var(--bg-surface-elevated); color: var(--fg-color); padding: var(--spacing-sm) var(--spacing-md); border-radius: var(--radius-md); }
        .btn-toggle { background: var(--bg-surface-elevated); border: 1px solid var(--border-color); color: var(--fg-color); padding: var(--spacing-sm) var(--spacing-md); border-radius: var(--radius-md); }
        
        .canvas-wrapper { display: flex; flex-direction: column; gap: var(--spacing-xl) * 2; }
        .canvas-wrapper.side { flex-direction: row; align-items: flex-start; gap: var(--spacing-lg); overflow-x: auto; padding-bottom: var(--spacing-xl); }
        .canvas-wrapper.side .canvas-section { min-width: 1000px; flex: 1; }
        
        .divider { height: 1px; background: var(--border-color); margin: var(--spacing-md) 0; position: relative; }
        .divider::after { content: 'VS'; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: var(--bg-color); padding: 0 10px; color: var(--fg-muted); font-weight: 700; font-size: 0.75rem; }
        
        @media (max-width: 1199px) {
          .canvas-wrapper.side { flex-direction: column; overflow-x: hidden; }
          .canvas-wrapper.side .canvas-section { min-width: 100%; }
          .btn-toggle { display: none; }
        }
      `}</style>
    </div>
  );
}
