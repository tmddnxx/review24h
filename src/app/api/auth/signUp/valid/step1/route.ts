
import { NextRequest, NextResponse } from "next/server";

// step 1 검증
export async function POST(req:NextRequest){
    const body = await req.json();
    console.log(body);

    // 체크 존재여부
    if(!body){
        return NextResponse.json({message: '사용자 약관동의를 진행해주세요', success: false});
    }

    // 체크 값 true 확인
    const result = Object.values(body).every(value => value === true)
    if(!result){
        return NextResponse.json({message: '사용자 약관동의를 진행해주세요', success: false});
    }

    return NextResponse.json({success: true});
}