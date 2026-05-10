import { NextRequest, NextResponse } from 'next/server';
import { getGeminiClient, MODEL_NAME, CANVAS_GENERATOR_PROMPT, parseGeminiResponse } from '@/lib/gemini';

/**
 * BMC 생성 API
 * POST /api/generate
 */
export async function POST(req: NextRequest) {
  try {
    const { apiKey, subject, vision, content, customers, values } = await req.json();

    if (!apiKey) {
      return NextResponse.json({ error: 'API 키가 필요합니다.' }, { status: 400 });
    }

    if (!subject || !vision) {
      return NextResponse.json({ error: '사업 주제와 비전은 필수 입력 사항입니다.' }, { status: 400 });
    }

    const client = getGeminiClient(apiKey);
    
    const userPrompt = `
사업 주제: ${subject}
사업 비전 및 목적: ${vision}
주요 사업 내용: ${content || '입력되지 않음'}
주요 고객군: ${customers || '입력되지 않음'}
핵심 가치: ${values || '입력되지 않음'}

위 정보를 바탕으로 전통적 BMC와 사회적 BMC를 생성해줘.
`;

    const response = await client.models.generateContent({
      model: MODEL_NAME,
      contents: [
        { role: 'user', parts: [{ text: CANVAS_GENERATOR_PROMPT + '\n' + userPrompt }] }
      ],
      config: {
        responseMimeType: 'application/json',
      }
    });

    const responseText = response.text || '';
    
    if (!responseText) {
      throw new Error('AI 응답이 비어 있습니다.');
    }

    const bmcData = parseGeminiResponse(responseText);

    return NextResponse.json(bmcData);
  } catch (error: any) {
    console.error('BMC 생성 오류:', error);
    return NextResponse.json(
      { error: error.message || 'BMC를 생성하는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
