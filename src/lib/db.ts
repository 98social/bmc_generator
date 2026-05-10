import { supabase } from './supabase';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';
const MOCK_DATA_PATH = path.join(process.cwd(), 'data', 'mock-db.json');

// Mock 데이터 초기화
if (USE_MOCK && !fs.existsSync(MOCK_DATA_PATH)) {
  if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
    fs.mkdirSync(path.join(process.cwd(), 'data'));
  }
  fs.writeFileSync(MOCK_DATA_PATH, JSON.stringify({ canvases: [], comments: [] }, null, 2));
}

const readMockData = () => {
  try {
    const content = fs.readFileSync(MOCK_DATA_PATH, 'utf-8');
    return JSON.parse(content);
  } catch (e) {
    return { canvases: [], comments: [] };
  }
};

const writeMockData = (data: any) => {
  fs.writeFileSync(MOCK_DATA_PATH, JSON.stringify(data, null, 2));
};

/**
 * DB 인터페이스 추상화
 */
export const db = {
  canvases: {
    async insert(item: any) {
      if (USE_MOCK) {
        const data = readMockData();
        const newItem = { 
          id: uuidv4(), 
          created_at: new Date().toISOString(),
          ...item 
        };
        data.canvases.push(newItem);
        writeMockData(data);
        return { data: newItem, error: null };
      }
      return await supabase.from('canvases').insert([item]).select().single();
    },

    async select(page = 1, limit = 10) {
      if (USE_MOCK) {
        const data = readMockData();
        const sorted = [...data.canvases].sort((a: any, b: any) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        const from = (page - 1) * limit;
        const to = from + limit;
        return { 
          data: sorted.slice(from, to), 
          count: data.canvases.length, 
          error: null 
        };
      }
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      return await supabase
        .from('canvases')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);
    },

    async getById(id: string) {
      if (USE_MOCK) {
        const data = readMockData();
        const item = data.canvases.find((c: any) => c.id === id);
        return { data: item, error: item ? null : { code: 'PGRST116', message: 'Not found' } };
      }
      return await supabase.from('canvases').select('*').eq('id', id).single();
    },

    async delete(id: string, sessionId?: string, isAdmin = false) {
      if (USE_MOCK) {
        const data = readMockData();
        const index = data.canvases.findIndex((c: any) => 
          c.id === id && (isAdmin || c.session_id === sessionId)
        );
        if (index === -1) return { error: { message: '권한이 없거나 찾을 수 없음' } };
        data.canvases.splice(index, 1);
        // 연관 댓글도 삭제
        data.comments = data.comments.filter((c: any) => c.canvas_id !== id);
        writeMockData(data);
        return { error: null };
      }
      let query = supabase.from('canvases').delete().eq('id', id);
      if (!isAdmin) query = query.eq('session_id', sessionId);
      return await query;
    }
  },

  comments: {
    async insert(item: any) {
      if (USE_MOCK) {
        const data = readMockData();
        const newItem = { 
          id: uuidv4(), 
          created_at: new Date().toISOString(),
          ...item 
        };
        data.comments.push(newItem);
        writeMockData(data);
        return { data: newItem, error: null };
      }
      return await supabase.from('comments').insert([item]).select().single();
    },

    async select(canvasId: string, blockKey?: string) {
      if (USE_MOCK) {
        const data = readMockData();
        let list = data.comments.filter((c: any) => c.canvas_id === canvasId);
        if (blockKey) {
          list = list.filter((c: any) => c.block_key === blockKey);
        } else {
          list = list.filter((c: any) => !c.block_key);
        }
        return { data: list.sort((a: any, b: any) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        ), error: null };
      }
      let query = supabase.from('comments').select('*').eq('canvas_id', canvasId).order('created_at', { ascending: true });
      if (blockKey) {
        query = query.eq('block_key', blockKey);
      } else {
        query = query.is('block_key', null);
      }
      return await query;
    },

    async delete(id: string, sessionId?: string, isAdmin = false) {
      if (USE_MOCK) {
        const data = readMockData();
        const index = data.comments.findIndex((c: any) => 
          c.id === id && (isAdmin || c.session_id === sessionId)
        );
        if (index === -1) return { error: { message: '권한이 없거나 찾을 수 없음' } };
        data.comments.splice(index, 1);
        writeMockData(data);
        return { error: null };
      }
      let query = supabase.from('comments').delete().eq('id', id);
      if (!isAdmin) query = query.eq('session_id', sessionId);
      return await query;
    }
  }
};
