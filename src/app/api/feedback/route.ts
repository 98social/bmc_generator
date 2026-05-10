import { NextRequest, NextResponse } from 'next/server';
import { getGeminiClient, MODEL_NAME, LOGIC_VALIDATOR_PROMPT, parseGeminiResponse } from '@/lib/gemini';

/**
 * AI 피드백 생성 API
 * POST /api/feedback
 */
export async function POST(req: NextRequest) {
  try {
    const { apiKey, traditional_bmc, social_bmc } = await req.json();

    if (!apiKey) {
      return NextResponse.json({ error: 'API 키가 필요합니다.' }, { status: 400 });
    }

    const client = getGeminiClient(apiKey);
    
    const contextPrompt = `
검토할 비즈니스 모델 데이터:
전통적 BMC: ${JSON.stringify(traditional_bmc)}
사회적 BMC: ${JSON.stringify(social_bmc)}

위 비즈니스 모델의 논리적 타당성을 검토하고 피드백을 제공해줘.
`;

    const response = await client.models.generateContent({
      model: MODEL_NAME,
      contents: [
        { role: 'user', parts: [{ text: LOGIC_VALIDATOR_PROMPT + '\n' + contextPrompt }] }
      ],
      config: {
        responseMimeType: 'application/json',
      }
    });

    const responseText = response.text || '';
    
    if (!responseText) {
      throw new Error('AI 응답이 비어 있습니다.');
    }

    const feedbackData = parseGeminiResponse(responseText);

    return NextResponse.json(feedbackData);
  } catch (error: any) {
    console.error('피드백 생성 오류:', error);
    return NextResponse.json(
      { error: error.message || '피드백을 생성하는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
