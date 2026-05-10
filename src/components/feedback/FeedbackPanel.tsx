'use client';

import React from 'react';

interface FeedbackItem {
  category: string;
  description: string;
  score: number;
  comment: string;
}

interface FeedbackPanelProps {
  feedback?: {
    overall_score: number;
    overall_comment: string;
    items: FeedbackItem[];
  };
}

const FeedbackPanel: React.FC<FeedbackPanelProps> = ({ feedback }) => {
  if (!feedback) return null;

  return (
    <div className="feedback-panel animate-fade-in">
      <div className="overall-card">
        <div className="overall-score">
          <span className="score-value">{feedback.overall_score}</span>
          <span className="score-label">종합 점수</span>
        </div>
        <div className="overall-comment">
          <h3>AI 종합 분석</h3>
          <p>{feedback.overall_comment}</p>
        </div>
      </div>

      <div className="items-grid">
        {feedback.items.map((item, idx) => (
          <div key={idx} className="item-card">
            <div className="item-header">
              <span className="item-category">{item.category}</span>
              <span className="item-score" style={{ color: getScoreColor(item.score) }}>
                {item.score}점
              </span>
            </div>
            <p className="item-desc">{item.description}</p>
            <p className="item-comment">{item.comment}</p>
          </div>
        ))}
      </div>

      <p className="ai-disclaimer">이 의견은 AI 모델에 의해 생성된 분석입니다.</p>

      <style jsx>{`
        .feedback-panel {
          background-color: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: var(--spacing-xl);
          margin-top: var(--spacing-xl);
        }
        .overall-card {
          display: flex;
          gap: var(--spacing-xl);
          align-items: center;
          padding-bottom: var(--spacing-xl);
          border-bottom: 1px solid var(--border-color);
          margin-bottom: var(--spacing-xl);
        }
        .overall-score {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 120px;
          height: 120px;
          border-radius: var(--radius-full);
          background: conic-gradient(var(--color-trad) ${feedback.overall_score}%, var(--bg-surface-elevated) 0);
          position: relative;
        }
        .overall-score::after {
          content: '';
          position: absolute;
          width: 90px;
          height: 90px;
          background-color: var(--bg-surface);
          border-radius: var(--radius-full);
        }
        .score-value {
          position: relative;
          z-index: 1;
          font-size: 2rem;
          font-weight: 800;
          font-family: 'Outfit', sans-serif;
        }
        .score-label {
          position: relative;
          z-index: 1;
          font-size: 0.75rem;
          color: var(--fg-muted);
        }
        .overall-comment h3 { margin-bottom: var(--spacing-xs); }
        .overall-comment p { color: var(--fg-muted); }
        
        .items-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: var(--spacing-lg);
        }
        .item-card {
          background-color: var(--bg-color);
          padding: var(--spacing-lg);
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
        }
        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-xs);
        }
        .item-category { font-weight: 700; font-size: 0.875rem; }
        .item-score { font-weight: 800; }
        .item-desc { font-size: 0.75rem; color: var(--fg-muted); margin-bottom: var(--spacing-sm); }
        .item-comment { font-size: 0.875rem; }
        
        .ai-disclaimer {
          margin-top: var(--spacing-xl);
          text-align: center;
          font-size: 0.75rem;
          color: var(--fg-muted);
          font-style: italic;
        }
      `}</style>
    </div>
  );
};

const getScoreColor = (score: number) => {
  if (score >= 80) return 'var(--color-success)';
  if (score >= 60) return 'var(--color-warning)';
  return 'var(--color-error)';
};

export default FeedbackPanel;
