import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

/**
 * 의견 저장 및 조회
 */

export async function POST(req: NextRequest) {
  try {
    const { canvas_id, session_id, canvas_type, block_key, content } = await req.json();

    if (!canvas_id || !session_id || !content) {
      return NextResponse.json({ error: '필수 정보가 누락되었습니다.' }, { status: 400 });
    }

    const { data, error } = await db.comments.insert({ 
      canvas_id, session_id, canvas_type, block_key, content 
    });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('의견 저장 오류:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const canvasId = searchParams.get('canvas_id');
    const blockKey = searchParams.get('block_key');

    if (!canvasId) {
      return NextResponse.json({ error: 'canvas_id가 필요합니다.' }, { status: 400 });
    }

    const { data, error } = await db.comments.select(canvasId, blockKey || undefined);

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('의견 조회 오류:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const sessionId = req.headers.get('x-session-id');
    const adminPassword = req.headers.get('x-admin-password');
    const serverAdminPassword = process.env.ADMIN_PASSWORD;

    if (!id) {
      return NextResponse.json({ error: 'id가 필요합니다.' }, { status: 400 });
    }

    const isAdmin = serverAdminPassword && adminPassword === serverAdminPassword;
    const { error } = await db.comments.delete(id, sessionId || undefined, !!isAdmin);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('의견 삭제 오류:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
