import { v4 as uuidv4 } from 'uuid';

/**
 * 브라우저 세션 동안 유지되는 익명 ID를 가져오거나 생성합니다.
 */
export const getSessionId = (): string => {
  if (typeof window === 'undefined') return '';
  
  let sessionId = localStorage.getItem('bmc_session_id');
  
  if (!sessionId) {
    sessionId = uuidv4();
    localStorage.getItem('bmc_session_id');
    localStorage.setItem('bmc_session_id', sessionId);
  }
  
  return sessionId;
};
