'use client';

import React from 'react';

interface BlockCardProps {
  blockKey: string;
  label: string;
  content: string;
  gridArea: string;
  colorVar?: string;
  onCommentClick?: (blockKey: string, label: string) => void;
}

const BlockCard: React.FC<BlockCardProps> = ({ 
  blockKey, 
  label, 
  content, 
  gridArea, 
  colorVar,
  onCommentClick 
}) => {
  return (
    <div className="block-card" style={{ gridArea }}>
      <div className="header" style={colorVar ? { color: `var(${colorVar})` } : {}}>
        <span className="label">{label}</span>
        {onCommentClick && (
          <button 
            className="comment-btn" 
            onClick={() => onCommentClick(blockKey, label)}
            title="의견 달기"
          >
            💬
          </button>
        )}
      </div>
      <div className="content">
        {content || <span className="placeholder">AI 분석 중...</span>}
      </div>

      <style jsx>{`
        .block-card {
          background-color: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: var(--spacing-md);
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
          min-height: 100px;
          transition: var(--transition-fast);
          position: relative;
        }
        .block-card:hover {
          border-color: var(--fg-muted);
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: 700;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--fg-muted);
        }
        .content {
          font-size: 0.875rem;
          white-space: pre-wrap;
          flex: 1;
        }
        .placeholder {
          color: var(--bg-surface-elevated);
          font-style: italic;
        }
        .comment-btn {
          opacity: 0;
          transition: var(--transition-fast);
          font-size: 0.875rem;
        }
        .block-card:hover .comment-btn {
          opacity: 1;
        }
        .comment-btn:hover {
          transform: scale(1.2);
        }
      `}</style>
    </div>
  );
};

export default BlockCard;
