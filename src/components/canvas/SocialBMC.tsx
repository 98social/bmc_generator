'use client';

import React from 'react';
import BlockCard from './BlockCard';
import { SOCIAL_BLOCKS } from '@/lib/bmc-schema';

interface SocialBMCProps {
  data?: any;
  onCommentClick?: (blockKey: string, label: string) => void;
}

const SocialBMC: React.FC<SocialBMCProps> = ({ data, onCommentClick }) => {
  const blocks = data?.blocks || {};

  return (
    <div className="bmc-container">
      <h2 className="title">🌱 {data?.title || '사회적 비즈니스 모델 캔버스 (SPO용)'}</h2>
      <div className="bmc-grid-11 animate-fade-in">
        {SOCIAL_BLOCKS.map((block) => (
          <BlockCard
            key={block.key}
            blockKey={block.key}
            label={block.label}
            content={blocks[block.key]?.content || ''}
            gridArea={block.gridArea}
            colorVar={block.colorVar}
            onCommentClick={onCommentClick}
          />
        ))}
      </div>

      <style jsx>{`
        .bmc-container {
          width: 100%;
        }
        .title {
          margin-bottom: var(--spacing-lg);
          font-size: 1.5rem;
          color: var(--color-social-light);
        }
      `}</style>
    </div>
  );
};

export default SocialBMC;
