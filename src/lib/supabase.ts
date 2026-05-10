import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const isValidUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * Supabase 클라이언트 (브라우저 및 서버 공용)
 * Mock 모드이거나 유효한 URL이 아니면 null 반환
 */
export const supabase = (supabaseUrl && supabaseAnonKey && isValidUrl(supabaseUrl))
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (null as any);

/**
 * 서버 사이드에서 session_id 헤더를 포함하여 삭제 등의 권한을 처리할 때 사용하는 함수
 */
export const getSupabaseServerClient = (sessionId: string) => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        'x-session-id': sessionId,
      },
    },
  });
};
