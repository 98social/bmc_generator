import { GoogleGenAI } from '@google/genai';

/**
 * Gemini API 클라이언트 유틸리티
 */

export const MODEL_NAME = 'gemini-2.5-flash';

export const CANVAS_GENERATOR_PROMPT = `
당신은 전문 비즈니스 전략가이자 사회적 가치 창출 조직(SPO) 컨설턴트입니다.
사용자가 입력한 '사업 목적, 비전, 내용'을 바탕으로 다음 두 가지 비즈니스 모델 캔버스 초안을 작성하십시오.

1. 전통적 비즈니스 모델 캔버스 (9 Blocks): 경제적 수익과 운영 효율에 집중.
2. 사회적 비즈니스 모델 캔버스 for SPOs (11 Blocks): Qastharin(2014) 모델. '미션'과 '영향 및 측정'을 포함하며, 고객 세그먼트를 '공동생산자(Co-creator)'와 '수혜자(Beneficiary)'로 구분.

작성 규칙:
- 미션 정렬: 사회적 BMC의 모든 블록은 조직의 핵심 사명(Mission)과 연결되어야 함.
- 이중 목적 반영: 사회적 이익(Impact)과 지속 가능한 수익원(Revenue Streams)의 관계를 명확히 할 것.
- 고객 이중 분류: 공동생산자(Co-creator)와 수혜자(Beneficiary)를 반드시 구분.
- 출력 형식: 반드시 아래의 JSON 구조로만 응답하십시오. JSON 외의 텍스트는 절대 포함하지 마십시오.

JSON 구조:
{
  "traditional_bmc": {
    "title": "전통적 비즈니스 모델 캔버스",
    "blocks": {
      "customer_segments": { "label": "고객 세그먼트", "content": "..." },
      "value_propositions": { "label": "가치 제안", "content": "..." },
      "channels": { "label": "채널", "content": "..." },
      "customer_relationships": { "label": "고객 관계", "content": "..." },
      "revenue_streams": { "label": "수익 흐름", "content": "..." },
      "key_resources": { "label": "핵심 자원", "content": "..." },
      "key_activities": { "label": "핵심 활동", "content": "..." },
      "key_partners": { "label": "핵심 파트너", "content": "..." },
      "cost_structure": { "label": "비용 구조", "content": "..." }
    }
  },
  "social_bmc": {
    "title": "사회적 비즈니스 모델 캔버스 (SPO용)",
    "blocks": {
      "mission": { "label": "미션", "content": "..." },
      "customer_segments_co_creator": { "label": "고객 세그먼트 - 공동생산자", "content": "..." },
      "customer_segments_beneficiary": { "label": "고객 세그먼트 - 수혜자", "content": "..." },
      "value_propositions": { "label": "가치 제안", "content": "..." },
      "customer_relationships": { "label": "고객 관계", "content": "..." },
      "channels": { "label": "채널", "content": "..." },
      "key_activities": { "label": "핵심 활동", "content": "..." },
      "key_resources": { "label": "핵심 자원", "content": "..." },
      "key_partners": { "label": "핵심 파트너", "content": "..." },
      "cost_structure": { "label": "비용 구조", "content": "..." },
      "revenue_streams": { "label": "수익 흐름", "content": "..." },
      "impact_measurement": { "label": "영향 및 측정", "content": "..." }
    }
  }
}
`;

export const LOGIC_VALIDATOR_PROMPT = `
당신은 비즈니스 모델 논리 검증 전문가입니다.
응답 첫 줄에 반드시 "이 의견은 AI 모델에 의해 생성된 분석입니다."를 표기하십시오.
생성된 캔버스의 논리적 타당성을 검토하여 아래 JSON 구조로 응답하십시오.

JSON 구조:
{
  "ai_feedback": {
    "overall_score": 0,
    "overall_comment": "...",
    "items": [
      { "category": "논리적 일관성", "description": "...", "score": 0, "comment": "..." },
      { "category": "수익 지속성", "description": "...", "score": 0, "comment": "..." },
      { "category": "임팩트 측정", "description": "...", "score": 0, "comment": "..." },
      { "category": "미션 정렬", "description": "...", "score": 0, "comment": "..." },
      { "category": "이해관계자 포괄성", "description": "...", "score": 0, "comment": "..." }
    ]
  }
}
`;

/**
 * Gemini 클라이언트를 생성합니다.
 * @google/genai SDK의 GoogleGenAI 클래스 사용
 */
export const getGeminiClient = (apiKey: string) => {
  return new GoogleGenAI({ apiKey });
};

/**
 * 텍스트에서 JSON 블록을 추출하고 파싱합니다.
 */
export const parseGeminiResponse = (text: string) => {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(text);
  } catch (error) {
    console.error("JSON 파싱 실패:", error);
    throw new Error("AI 응답 형식이 올바르지 않습니다.");
  }
};
