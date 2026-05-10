# BMC Generator - 코드 생성 지침 (Code Generation Instructions)

## 개요

사용자가 입력한 사업 목적과 비전을 바탕으로 두 가지 비즈니스 모델 캔버스를 자동 생성하고,
AI 피드백과 커뮤니티 의견을 받을 수 있는 웹 시스템의 구현 지침입니다.

- **참조 1 (전통적 BMC)**: Osterwalder & Pigneur(2010), Boldare Blog — *Business Model Canvas*
- **참조 2 (사회적 BMC)**: 최진숙·전재희(KCI), *사회목적조직(SPOs)의 비즈니스 모델 캔버스 연구* — Qastharin(2014) 캔버스 적용

---

## 1. 프롬프트 엔지니어링 지침 (AI 생성 로직)

AI가 사용자의 목적과 비전을 분석하여 전통적 BMC(9블록)와 사회적 BMC(11블록)를 동시에 생성하도록 하는 시스템 프롬프트입니다.

### [System Prompt: Canvas Generator]

> **역할**: 너는 전문 비즈니스 전략가이자 사회적 가치 창출 조직(SPO) 컨설턴트야.
>
> **임무**: 사용자가 입력한 '사업 목적, 비전, 내용'을 바탕으로 다음 두 가지 비즈니스 모델 캔버스 초안을 작성하라.
>
> 1. **전통적 비즈니스 모델 캔버스 (9 Blocks)**: 경제적 수익과 운영 효율에 집중 (Osterwalder & Pigneur, 2010).
> 2. **사회적 비즈니스 모델 캔버스 for SPOs (11 Blocks)**: Qastharin(2014)이 제안한 사회적 기업용 수정 BMC. '미션'과 '영향 및 측정'을 포함하며, 고객 세그먼트를 '공동생산자(Co-creator)'와 '수혜자(Beneficiary)'로 구분하여 사회적 가치와 경제적 수익의 균형을 분석.
>
> **작성 규칙**:
> - **미션 정렬**: 사회적 BMC의 모든 블록은 조직의 핵심 사명(Mission)과 연결되어야 함.
> - **이중 목적 반영**: 사회적 이익(Impact)과 지속 가능한 수익원(Revenue Streams)의 관계를 명확히 할 것.
> - **고객 이중 분류**: 공동생산자(Co-creator, 기부자·자원봉사자·협력기관 등)와 수혜자(Beneficiary, 서비스 수령자)를 반드시 구분하여 작성.
> - **출력 형식**: 웹 UI 표현을 위해 반드시 아래의 JSON 구조로만 응답할 것. JSON 외의 텍스트는 절대 포함하지 말 것.

```json
{
  "traditional_bmc": {
    "title": "전통적 비즈니스 모델 캔버스",
    "blocks": {
      "customer_segments": {
        "label": "고객 세그먼트",
        "content": "..."
      },
      "value_propositions": {
        "label": "가치 제안",
        "content": "..."
      },
      "channels": {
        "label": "채널",
        "content": "..."
      },
      "customer_relationships": {
        "label": "고객 관계",
        "content": "..."
      },
      "revenue_streams": {
        "label": "수익 흐름",
        "content": "..."
      },
      "key_resources": {
        "label": "핵심 자원",
        "content": "..."
      },
      "key_activities": {
        "label": "핵심 활동",
        "content": "..."
      },
      "key_partners": {
        "label": "핵심 파트너",
        "content": "..."
      },
      "cost_structure": {
        "label": "비용 구조",
        "content": "..."
      }
    }
  },
  "social_bmc": {
    "title": "사회적 비즈니스 모델 캔버스 (SPO용)",
    "blocks": {
      "mission": {
        "label": "미션",
        "content": "..."
      },
      "customer_segments_co_creator": {
        "label": "고객 세그먼트 - 공동생산자",
        "content": "..."
      },
      "customer_segments_beneficiary": {
        "label": "고객 세그먼트 - 수혜자",
        "content": "..."
      },
      "value_propositions": {
        "label": "가치 제안",
        "content": "..."
      },
      "customer_relationships": {
        "label": "고객 관계",
        "content": "..."
      },
      "channels": {
        "label": "채널",
        "content": "..."
      },
      "key_activities": {
        "label": "핵심 활동",
        "content": "..."
      },
      "key_resources": {
        "label": "핵심 자원",
        "content": "..."
      },
      "key_partners": {
        "label": "핵심 파트너",
        "content": "..."
      },
      "cost_structure": {
        "label": "비용 구조",
        "content": "..."
      },
      "revenue_streams": {
        "label": "수익 흐름",
        "content": "..."
      },
      "impact_measurement": {
        "label": "영향 및 측정",
        "content": "..."
      }
    }
  }
}
```

---

## 2. 블록 정의 명세

### 2-1. 전통적 BMC 9개 블록 정의 (Osterwalder & Pigneur, 2010 / Boldare)

| # | 블록명 (영문) | 블록명 (한국어) | 정의 |
|---|---|---|---|
| 1 | Customer Segments | 고객 세그먼트 | 비즈니스가 해결하려는 문제를 가진 목표 고객군. 상위 3개 세그먼트 정의 (매출 기여도 기준). |
| 2 | Value Propositions | 가치 제안 | 고객에게 제공하는 제품/서비스. 고객의 문제(Pain Point)를 어떻게 해결하며, 경쟁사와의 차별점은 무엇인가. |
| 3 | Channels | 채널 | 고객과 어떻게 접점을 만드는가. 오프라인(매장·영업사원)과 온라인(웹·앱·SNS) 채널 포함. |
| 4 | Customer Relationships | 고객 관계 | 고객을 어떻게 유지하고 관계를 유지하는가. 자동화(Amazon 방식) vs. 개인화 방식. |
| 5 | Revenue Streams | 수익 흐름 | 수익 창출 방식. 직접 판매, 구독, 라이선스, 프리미엄, 광고 등. |
| 6 | Key Resources | 핵심 자원 | 비즈니스 운영에 필요한 인력·지식·공간·IP·예산 등. |
| 7 | Key Activities | 핵심 활동 | 가치 제안 실현을 위해 매일 수행하는 핵심 업무. |
| 8 | Key Partners | 핵심 파트너 | 비즈니스가 의존하는 외부 기관·공급사·협력사·전략적 제휴. |
| 9 | Cost Structure | 비용 구조 | 비즈니스 운영의 전체 비용. 고정비(임대료·인건비)와 변동비(생산비·마케팅) 구분. |

### 2-2. 사회적 BMC 11개 블록 정의 (Qastharin, 2014 — SPO용)

> **출처**: 최진숙·전재희 (2022), 『사회목적조직(SPOs)의 비즈니스 모델 캔버스 연구』, KCI 등재지.
> Qastharin(2014)이 제안한 *Modified Business Model Canvas for Social Enterprise*를 기반으로 Osterwalder & Pigneur(2010)의 전통적 BMC를 SPO 특성에 맞게 수정한 캔버스.

| # | 블록명 (영문) | 블록명 (한국어) | 정의 |
|---|---|---|---|
| 1 | **Mission** | **미션** | 조직의 사회적 목적, 핵심 사명, 사회적·경제적 가치와 고객·핵심 활동·수익의 균형을 규범적 차원에서 정의. |
| 2 | Customer Segments — Co-creator | 고객 세그먼트 — 공동생산자 | 조직으로 가치를 제공하는 주체. 기부자(donors), 자원봉사자(volunteers), 협력기관, 구성원 등. 자원·노동·지식을 제공하여 사회적 가치 창출에 참여. |
| 3 | Customer Segments — Beneficiary | 고객 세그먼트 — 수혜자 | 조직으로부터 가치를 전달받는 최종 대상. 서비스 수령자, 취약계층, 지역사회 등. |
| 4 | Value Propositions | 가치 제안 | 공동생산자와 수혜자 각각에게 전달하는 가치. 사회적 가치(임팩트)와 경제적 가치(수익) 이중 가치를 반영. |
| 5 | Customer Relationships | 고객 관계 | 조직이 특정 고객 세그먼트와 맺는 관계 유형. 공동생산자·수혜자별로 각각 정의. |
| 6 | Channels | 채널 | 비즈니스가 가치를 전달하기 위해 고객과 소통하는 방법. 온·오프라인 접점 포함. |
| 7 | Key Activities | 핵심 활동 | 조직이 각 고객 세그먼트로부터 가치를 창출하는 핵심 업무. |
| 8 | Key Resources | 핵심 자원 | 비즈니스 모델 구동에 필요한 가장 중요한 자산. 물적·인적·지적·재무 자원. |
| 9 | Key Partners | 핵심 파트너 | 비즈니스 모델 구현에 참여하는 협력 네트워크. 공급자, NPO·NGO, 정부기관, 관련 기업 등. |
| 10 | Cost Structure | 비용 구조 | 비즈니스 모델 운영에서 발생하는 모든 비용. 직접비(인건비·운영비)와 간접비(고정비·임대료 등). |
| 11 | Revenue Streams | 수익 흐름 | 가치 창출을 위해 각 고객 세그먼트로부터 발생하는 수익. 자립 가능한 지속 수익 구조 설계 필요. |
| 12 | **Impact & Measurement** | **영향 및 측정** | 기업의 성장과 발전에 기여하는 방식으로의 사회적 영향과 그 측정 지표 및 고객 만족도를 정의. |

> **전통적 BMC 대비 SPO BMC 주요 차이점**:
> - `Mission` 블록 추가 (조직의 존재 이유와 사명 명시)
> - `Customer Segments`를 **공동생산자 / 수혜자**로 분리
> - `Impact & Measurement` 블록 추가 (사회적 가치 측정)
> - 총 9블록 → 11블록 (미션 +1, 고객 세그먼트 분리 +1, 영향·측정 +1)

---

## 3. AI 객관적 피드백 생성 지침 (Review Logic)

생성된 캔버스의 논리적 타당성을 검토하는 별도 AI 프롬프트.

### [System Prompt: Logic Validator]

> **전제**: 응답 첫 줄에 반드시 "이 의견은 AI 모델에 의해 생성된 분석입니다."를 표기하라.
>
> **검토 항목 및 출력 JSON 구조**:

```json
{
  "ai_feedback": {
    "overall_score": 0,
    "overall_comment": "...",
    "items": [
      {
        "category": "논리적 일관성",
        "description": "가치 제안이 설정된 고객/수혜자의 문제를 실제로 해결하는가?",
        "score": 0,
        "comment": "..."
      },
      {
        "category": "수익 지속성",
        "description": "단순 보조금이 아닌 자립 가능한 수익 구조(Sustainable Revenue Streams)가 설계되었는가?",
        "score": 0,
        "comment": "..."
      },
      {
        "category": "임팩트 측정",
        "description": "'영향 및 측정' 지표가 구체적이고 실행 가능한가?",
        "score": 0,
        "comment": "..."
      },
      {
        "category": "미션 정렬",
        "description": "모든 블록이 핵심 미션과 일관되게 연결되어 있는가? (사회적 BMC 전용)",
        "score": 0,
        "comment": "..."
      },
      {
        "category": "이해관계자 포괄성",
        "description": "공동생산자와 수혜자가 명확히 구분되어 있으며, 다양한 이해관계자를 고려하고 있는가?",
        "score": 0,
        "comment": "..."
      }
    ]
  }
}
```

> - `score`: 0~100점 정수
> - **톤앤매너**: 객관적·비판적 시각에서 개선안을 제안하는 Peer-review 스타일. 칭찬보다 구체적 개선 방향 중심.

---

## 4. 웹 시스템 구현 가이드

### 4-1. 기술 스택

| 영역 | 기술 | 비고 |
|---|---|---|
| 프론트엔드 | Next.js (App Router) + Vanilla CSS | Tailwind 미사용 (디자인 시스템 직접 구현) |
| AI 연동 | Google Generative AI SDK (`@google/generative-ai`) | `gemini-1.5-flash` 또는 최신 경량 모델 |
| 데이터 저장 | Supabase (PostgreSQL) | 익명 세션 기반 |
| API 키 보안 | Next.js API Route를 프록시로 활용 | 브라우저에 키 노출 방지 |

### 4-2. API 키 보안 전략

- 사용자가 입력한 Google API Key는 **브라우저 localStorage에 저장하지 않음**.
- 대신 Next.js API Route (`/api/generate`)를 프록시로 사용:
  1. 사용자 입력 키를 서버로 전달 (HTTPS POST)
  2. 서버에서 AI 호출 후 결과만 클라이언트로 반환
  3. 키는 서버 메모리에서만 사용되며 DB에 저장하지 않음

### 4-3. 익명 데이터 저장 (Supabase 스키마)

```sql
-- 캔버스 저장 테이블
CREATE TABLE canvases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,              -- 무작위 익명 세션 ID (user_id 없음)
  subject TEXT NOT NULL,                 -- 사업 주제/제목
  traditional_data JSONB,               -- 전통적 BMC JSON (9블록)
  social_data JSONB,                    -- 사회적 BMC JSON (11블록)
  ai_feedback JSONB,                    -- AI 피드백 JSON (구조화)
  is_public BOOLEAN DEFAULT true,       -- 공개 여부
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 블록별 의견 테이블
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  canvas_id UUID REFERENCES canvases(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,             -- 댓글 작성자 익명 세션
  canvas_type TEXT CHECK (canvas_type IN ('traditional', 'social')),
  block_key TEXT NOT NULL,              -- 블록 키 (예: 'value_propositions')
  content TEXT NOT NULL,               -- 의견 내용
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 4-4. 화면 구성 (UX 흐름)

```
[1단계] 사업 입력
  └─ 사업 주제, 목적, 비전, 주요 고객, 핵심 가치 입력

[2단계] 캔버스 자동 생성
  └─ 좌우 분할 레이아웃: 전통적 BMC(왼쪽) | 사회적 BMC(오른쪽)
  └─ 블록 하이라이트: 사회적 BMC에만 존재하는 블록(미션, 수혜자, 영향·측정) 강조

[3단계] AI 피드백
  └─ 항목별 점수와 코멘트 표시
  └─ "객관적 피드백 받기" 버튼으로 선택적 실행

[4단계] 공유 및 열람
  └─ 공개 캔버스 목록 (익명)
  └─ 타인 캔버스 상세 보기
  └─ 블록 클릭 → 해당 블록에 대한 의견 작성
  └─ 전체 캔버스에 대한 종합 의견 작성
```

---

## 5. 수행 작업 체크리스트

- [ ] **API 키 입력 UI**: Google AI Studio 키 발급 링크 + 입력창 최상단 배치. 키는 세션 상태에만 보관.
- [ ] **캔버스 시각화 컴포넌트**
  - 전통적 BMC: 9블록 격자 레이아웃 (Osterwalder 표준 배치)
  - 사회적 BMC: 11블록 격자 레이아웃 (미션을 상단, 영향·측정을 하단에 배치)
  - AI 반환 JSON 데이터를 각 블록 키에 매핑
- [ ] **비교 모드**: 두 캔버스 차이점 시각적 하이라이트 (사회적 BMC 전용 블록 강조)
- [ ] **AI 피드백 패널**: 항목별 점수 시각화 (레이더 차트 권장)
- [ ] **캔버스 저장**: Supabase에 익명 session_id 기반 저장
- [ ] **열람 페이지**: 공개 캔버스 목록 → 상세 보기
- [ ] **블록별 의견 시스템**: 블록 클릭 시 의견 작성 사이드패널 표시
- [ ] **전체 의견 시스템**: 캔버스 하단 종합 의견 섹션