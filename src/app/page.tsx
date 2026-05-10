'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApiKey } from '@/context/ApiKeyContext';
import { getSessionId } from '@/lib/session';

export default function Home() {
  const router = useRouter();
  const { hasKey } = useApiKey();
  const [formData, setFormData] = useState({
    subject: '',
    vision: '',
    content: '',
    customers: '',
    values: '',
    org_type: 'spo'
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasKey) {
      alert('Gemini API 키를 먼저 설정해주세요.');
      return;
    }

    setIsLoading(true);
    
    // 세션 스토리지에 입력 데이터 임시 저장 (결과 페이지에서 사용)
    sessionStorage.setItem('current_input_data', JSON.stringify(formData));
    
    router.push('/generate');
  };

  return (
    <div className="container animate-fade-in">
      <section className="hero">
        <h1>비즈니스 모델의 가치를 <span className="highlight">AI</span>로 혁신하세요</h1>
        <p className="hero-desc">
          사회적 목적 조직(SPO)을 위한 11블록 캔버스와 전통적 9블록 캔버스를 동시에 생성하고,<br />
          AI의 객관적인 피드백과 커뮤니티의 의견을 받아보세요.
        </p>
      </section>

      <form onSubmit={handleSubmit} className="input-form">
        <div className="form-group">
          <label htmlFor="subject">사업 주제 (제목) *</label>
          <input
            id="subject"
            name="subject"
            type="text"
            placeholder="예: 친환경 폐기물 관리 솔루션, 노인 맞춤형 일자리 플랫폼 등"
            value={formData.subject}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="vision">사업 목적 및 비전 *</label>
          <textarea
            id="vision"
            name="vision"
            placeholder="이 사업을 통해 해결하려는 사회적 문제와 궁극적인 목표를 입력하세요."
            value={formData.vision}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>비즈니스 모델 유형</label>
            <div className="info-badge">전통적(9블록) & 사회적(11블록) 동시 생성</div>
          </div>
          <div className="form-group">
            <label htmlFor="customers">주요 고객/수혜자 (선택)</label>
            <input
              id="customers"
              name="customers"
              type="text"
              placeholder="예: 지자체, 저소득층 노인 등"
              value={formData.customers}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="content">주요 사업 내용 (선택)</label>
          <textarea
            id="content"
            name="content"
            placeholder="어떤 제품이나 서비스를 제공하는지 구체적으로 설명해주세요."
            value={formData.content}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="values">핵심 가치 (선택)</label>
          <input
            id="values"
            name="values"
            type="text"
            placeholder="예: 지속 가능성, 투명성, 시니어 권익 보호 등"
            value={formData.values}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="submit-btn" disabled={isLoading}>
          {isLoading ? '분석 중...' : '캔버스 생성하기 🚀'}
        </button>
      </form>

      <style jsx>{`
        .hero {
          text-align: center;
          margin-bottom: var(--spacing-xl);
          padding: var(--spacing-xl) 0;
        }
        h1 { font-size: 3rem; margin-bottom: var(--spacing-md); line-height: 1.2; }
        .highlight { color: var(--color-trad-light); }
        .hero-desc { color: var(--fg-muted); font-size: 1.125rem; max-width: 800px; margin: 0 auto; }
        
        .input-form {
          max-width: 800px;
          margin: 0 auto;
          background-color: var(--bg-surface);
          padding: var(--spacing-xl);
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-lg);
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg);
        }
        
        .form-group { display: flex; flex-direction: column; gap: var(--spacing-xs); }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-md); }
        label { font-weight: 600; font-size: 0.875rem; color: var(--fg-muted); }
        
        textarea { min-height: 100px; }
        select {
          background-color: var(--bg-surface);
          border: 1px solid var(--border-color);
          color: var(--fg-color);
          padding: var(--spacing-sm) var(--spacing-md);
          border-radius: var(--radius-md);
        }
        
        .info-badge {
          background-color: var(--bg-surface-elevated);
          padding: var(--spacing-sm) var(--spacing-md);
          border-radius: var(--radius-md);
          font-size: 0.875rem;
          color: var(--color-trad-light);
          font-weight: 600;
          border: 1px solid var(--border-color);
        }
        
        .submit-btn {
          margin-top: var(--spacing-md);
          background: linear-gradient(135deg, var(--color-trad) 0%, var(--color-social) 100%);
          color: white;
          padding: var(--spacing-md);
          border-radius: var(--radius-md);
          font-size: 1.125rem;
          font-weight: 700;
          transition: var(--transition-normal);
        }
        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px -10px var(--color-trad);
        }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        @media (max-width: 640px) {
          .form-row { grid-template-columns: 1fr; }
          h1 { font-size: 2rem; }
        }
      `}</style>
    </div>
  );
}
