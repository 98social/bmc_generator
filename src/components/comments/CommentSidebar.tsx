'use client';

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { getSessionId } from '@/lib/session';

interface Comment {
  id: string;
  content: string;
  created_at: string;
}

interface CommentSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  canvasId: string;
  canvasType: 'traditional' | 'social';
  blockKey: string;
  blockLabel: string;
}

const CommentSidebar: React.FC<CommentSidebarProps> = ({
  isOpen,
  onClose,
  canvasId,
  canvasType,
  blockKey,
  blockLabel
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && canvasId && blockKey) {
      fetchComments();
      
      const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';
      if (USE_MOCK || !supabase) return; // Mock 모드이거나 Supabase 설정이 없으면 실시간 구독 스킵

      // 실시간 업데이트 구독
      const channel = supabase
        .channel(`comments-${canvasId}-${blockKey}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'comments',
            filter: `canvas_id=eq.${canvasId}&block_key=eq.${blockKey}`
          },
          (payload: any) => {
            setComments((prev) => [...prev, payload.new as Comment]);
          }
        )
        .subscribe();

      return () => {
        if (channel && supabase) {
          supabase.removeChannel(channel);
        }
      };
    }
  }, [isOpen, canvasId, blockKey]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [comments]);

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/comments?canvas_id=${canvasId}&block_key=${blockKey}`);
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('의견 로드 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('이 의견을 삭제하시겠습니까?')) return;

    const adminPassword = sessionStorage.getItem('admin_password');
    try {
      const response = await fetch(`/api/comments?id=${id}`, {
        method: 'DELETE',
        headers: {
          'x-admin-password': adminPassword || ''
        }
      });

      if (response.ok) {
        setComments((prev) => prev.filter((c) => c.id !== id));
      } else {
        const err = await response.json();
        alert('삭제 실패: ' + err.error);
      }
    } catch (error) {
      console.error('의견 삭제 실패:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          canvas_id: canvasId,
          session_id: getSessionId(),
          canvas_type: canvasType,
          block_key: blockKey,
          content: newComment
        })
      });

      if (response.ok) {
        setNewComment('');
        const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';
        if (USE_MOCK) fetchComments(); // Mock 모드에서는 수동으로 다시 불러오기
      }
    } catch (error) {
      console.error('의견 작성 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="overlay" onClick={onClose} />
      <div className="content">
        <div className="header">
          <h3>💬 {blockLabel} 의견</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="comments-list" ref={scrollRef}>
          {comments.length === 0 ? (
            <p className="no-comments">아직 의견이 없습니다. 첫 번째 의견을 남겨주세요!</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="comment-item">
                <div className="comment-header">
                  <span className="date">{new Date(comment.created_at).toLocaleString()}</span>
                  {sessionStorage.getItem('admin_password') && (
                    <button 
                      className="delete-btn" 
                      onClick={() => handleDelete(comment.id)}
                    >
                      삭제
                    </button>
                  )}
                </div>
                <p>{comment.content}</p>
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleSubmit} className="form">
          <textarea
            placeholder="이 항목에 대한 의견을 입력하세요..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={isLoading}
          />
          <button type="submit" className="submit-btn" disabled={isLoading || !newComment.trim()}>
            의견 등록
          </button>
        </form>
      </div>

      <style jsx>{`
        .sidebar {
          position: fixed;
          top: 0;
          right: -400px;
          width: 400px;
          height: 100%;
          z-index: 1500;
          transition: var(--transition-normal);
        }
        .sidebar.open {
          right: 0;
        }
        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          opacity: 0;
          pointer-events: none;
          transition: var(--transition-normal);
        }
        .sidebar.open .overlay {
          opacity: 1;
          pointer-events: auto;
        }
        .content {
          position: relative;
          background-color: var(--bg-surface);
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          box-shadow: -4px 0 15px rgba(0, 0, 0, 0.3);
          border-left: 1px solid var(--border-color);
        }
        .header {
          padding: var(--spacing-lg);
          border-bottom: 1px solid var(--border-color);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .close-btn { font-size: 1.25rem; color: var(--fg-muted); }
        
        .comments-list {
          flex: 1;
          overflow-y: auto;
          padding: var(--spacing-lg);
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }
        .comment-item {
          background-color: var(--bg-color);
          padding: var(--spacing-md);
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
        }
        .comment-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-xs);
        }
        .date { font-size: 0.75rem; color: var(--fg-muted); }
        .delete-btn {
          font-size: 0.7rem;
          color: var(--color-error);
          padding: 2px 6px;
          border: 1px solid var(--color-error);
          border-radius: 4px;
        }
        .no-comments { text-align: center; color: var(--fg-muted); margin-top: var(--spacing-xl); }
        
        .form {
          padding: var(--spacing-lg);
          border-top: 1px solid var(--border-color);
          background-color: var(--bg-surface-elevated);
        }
        textarea {
          width: 100%;
          height: 80px;
          margin-bottom: var(--spacing-sm);
          resize: none;
        }
        .submit-btn {
          width: 100%;
          background-color: var(--color-trad);
          color: white;
          padding: var(--spacing-sm);
          border-radius: var(--radius-md);
          font-weight: 600;
        }
        .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>
    </div>
  );
};

export default CommentSidebar;
