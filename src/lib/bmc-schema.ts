export type BMCBlock = {
  key: string;
  label: string;
  description: string;
  gridArea: string;
  colorVar?: string;
};

// 전통적 BMC 9블록 메타데이터
export const TRADITIONAL_BLOCKS: BMCBlock[] = [
  { key: 'key_partners', label: '핵심 파트너', description: '비즈니스 파트너 및 공급업체', gridArea: '1 / 1 / 3 / 2' },
  { key: 'key_activities', label: '핵심 활동', description: '가치 제안을 위한 주요 업무', gridArea: '1 / 2 / 2 / 3' },
  { key: 'key_resources', label: '핵심 자원', description: '필요한 인적, 물적 자산', gridArea: '2 / 2 / 3 / 3' },
  { key: 'value_propositions', label: '가치 제안', description: '고객에게 제공하는 해결책', gridArea: '1 / 3 / 3 / 4' },
  { key: 'customer_relationships', label: '고객 관계', description: '고객과 맺는 관계의 유형', gridArea: '1 / 4 / 2 / 5' },
  { key: 'channels', label: '채널', description: '가치를 전달하는 경로', gridArea: '2 / 4 / 3 / 5' },
  { key: 'customer_segments', label: '고객 세그먼트', description: '목표 고객군', gridArea: '1 / 5 / 3 / 6' },
  { key: 'cost_structure', label: '비용 구조', description: '발생하는 주요 비용', gridArea: '3 / 1 / 4 / 4' },
  { key: 'revenue_streams', label: '수익 흐름', description: '수익 창출원', gridArea: '3 / 4 / 4 / 6' },
];

// 사회적 BMC 11블록 메타데이터
export const SOCIAL_BLOCKS: BMCBlock[] = [
  { key: 'mission', label: '미션', description: '조직의 사회적 사명', gridArea: '1 / 1 / 2 / 6', colorVar: '--color-social' },
  { key: 'key_partners', label: '핵심 파트너', description: '협력 네트워크', gridArea: '2 / 1 / 4 / 2' },
  { key: 'key_activities', label: '핵심 활동', description: '가치 창출 업무', gridArea: '2 / 2 / 3 / 3' },
  { key: 'key_resources', label: '핵심 자원', description: '중요 자산', gridArea: '3 / 2 / 4 / 3' },
  { key: 'value_propositions', label: '가치 제안', description: '이중 가치 제안', gridArea: '2 / 3 / 4 / 4' },
  { key: 'customer_relationships', label: '고객 관계', description: '이해관계자 관계', gridArea: '2 / 4 / 3 / 5' },
  { key: 'channels', label: '채널', description: '소통 및 전달 방법', gridArea: '3 / 4 / 4 / 5' },
  { key: 'customer_segments_co_creator', label: '공동생산자', description: '가치 창출 참여자', gridArea: '2 / 5 / 3 / 6' },
  { key: 'customer_segments_beneficiary', label: '수혜자', description: '최종 혜택 대상', gridArea: '3 / 5 / 4 / 6' },
  { key: 'cost_structure', label: '비용 구조', description: '운영 비용', gridArea: '4 / 1 / 5 / 4' },
  { key: 'revenue_streams', label: '수익 흐름', description: '지속 가능 수익', gridArea: '4 / 4 / 5 / 6' },
  { key: 'impact_measurement', label: '영향 및 측정', description: '사회적 영향 평가지표', gridArea: '5 / 1 / 6 / 6', colorVar: '--color-social' },
];
