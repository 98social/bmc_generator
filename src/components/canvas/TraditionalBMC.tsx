'use client';

import React from 'react';
import BlockCard from './BlockCard';
import { TRADITIONAL_BLOCKS } from '@/lib/bmc-schema';

interface TraditionalBMCProps {
  data?: any;
  onCommentClick?: (blockKey: string, label: string) => void;
}

const TraditionalBMC: React.FC<TraditionalBMCProps> = ({ data, onCommentClick }) => {
  const blocks = data?.blocks || {};

  return (
    <div className="bmc-container">
      <h2 className="title">📊 {data?.title || '전통적 비즈니스 모델 캔버스'}</h2>
      <div className="bmc-grid-9 animate-fade-in">
        {TRADITIONAL_BLOCKS.map((block) => (
          <BlockCard
            key={block.key}
            blockKey={block.key}
            label={block.label}
            content={blocks[block.key]?.content || ''}
            gridArea={block.gridArea}
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
          color: var(--color-trad-light);
        }
      `}</style>
    </div>
  );
};

export default TraditionalBMC;
