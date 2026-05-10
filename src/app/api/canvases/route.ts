import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

/**
 * 캔버스 저장 및 목록 조회
 */

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { 
      session_id, 
      subject, 
      org_type, 
      input_data, 
      traditional_data, 
      social_data, 
      ai_feedback 
    } = data;

    if (!session_id || !subject) {
      return NextResponse.json({ error: '필수 정보가 누락되었습니다.' }, { status: 400 });
    }

    const { data: insertedData, error } = await db.canvases.insert({ 
      session_id, 
      subject, 
      org_type: org_type || 'spo', 
      input_data, 
      traditional_data, 
      social_data, 
      ai_feedback 
    });

    if (error) throw error;

    return NextResponse.json(insertedData);
  } catch (error: any) {
    console.error('캔버스 저장 오류:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    const { data, error, count } = await db.canvases.select(page, limit);

    if (error) throw error;

    return NextResponse.json({
      items: data,
      total: count,
      page,
      limit
    });
  } catch (error: any) {
    console.error('캔버스 목록 조회 오류:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
