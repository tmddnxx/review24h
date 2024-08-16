import { updateSocialID } from "@/services/AuthService";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        console.log("body ? ", body);

        // 요청 본문에서 필요 데이터를 추출합니다.
        const { mno, social, socialID } = body;

        // social 값을 'kakao' 또는 'naver'로 변환하여 사용합니다.
        if (social !== 'kakao' && social !== 'naver') {
            return NextResponse.json({ message: "Invalid provider" }, { status: 400 });
        }

        // updateSocialID 호출
        await updateSocialID(mno, social, socialID);

        // 성공적인 응답 반환
        return NextResponse.json({ message: "Social ID updated successfully" }, {status: 200});

    } catch (error) {
        console.error('Error updating social ID:', error);
        // 에러 발생 시 응답 반환
        return NextResponse.json({ message: "Failed to update social ID" }, { status: 500 });
    }
}