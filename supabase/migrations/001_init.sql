-- 캔버스 저장 테이블
CREATE TABLE canvases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,              -- 무작위 익명 세션 ID (user_id 없음)
  subject TEXT NOT NULL,                 -- 사업 주제/제목
  org_type TEXT NOT NULL,                -- 'general' / 'spo'
  input_data JSONB NOT NULL,             -- 사용자 입력 원본
  traditional_data JSONB,               -- 전통적 BMC JSON (9블록)
  social_data JSONB,                    -- 사회적 BMC JSON (11블록)
  ai_feedback JSONB,                    -- AI 피드백 JSON (구조화)
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 블록별 의견 테이블
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  canvas_id UUID REFERENCES canvases(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,             -- 댓글 작성자 익명 세션
  canvas_type TEXT CHECK (canvas_type IN ('traditional', 'social')),
  block_key TEXT,                       -- 블록 키 (null이면 전체 의견)
  content TEXT NOT NULL,               -- 의견 내용
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS (Row Level Security) 설정
ALTER TABLE canvases ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- 정책: 누구나 읽기 가능
CREATE POLICY "Allow public read access to canvases" ON canvases FOR SELECT USING (true);
CREATE POLICY "Allow public read access to comments" ON comments FOR SELECT USING (true);

-- 정책: 익명 세션으로 본인 캔버스 생성/삭제 가능 (수정은 정책상 제한하거나 session_id 확인)
CREATE POLICY "Allow anonymous insert to canvases" ON canvases FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous insert to comments" ON comments FOR INSERT WITH CHECK (true);

-- 정책: 본인 session_id인 경우에만 삭제 가능 (브라우저 session_id가 일치해야 함)
CREATE POLICY "Allow delete own canvases" ON canvases FOR DELETE USING (session_id = (current_setting('request.headers')::json->>'x-session-id'));
