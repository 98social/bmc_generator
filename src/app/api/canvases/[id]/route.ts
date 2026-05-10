import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

/**
 * 특정 캔버스 상세 조회
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { data, error } = await db.canvases.getById(id);

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: '캔버스를 찾을 수 없습니다.' }, { status: 404 });
      }
      throw error;
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('캔버스 상세 조회 오류:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * 캔버스 삭제
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const sessionId = req.headers.get('x-session-id');
    const adminPassword = req.headers.get('x-admin-password');
    const serverAdminPassword = process.env.ADMIN_PASSWORD;

    const isAdmin = serverAdminPassword && adminPassword === serverAdminPassword;
    const { error } = await db.canvases.delete(id, sessionId || undefined, !!isAdmin);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('캔버스 삭제 오류:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
