import { getBaminUserByID } from "@/services/BaminAuthService";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    const body = await req.json();
    const {baminID} = body;
    
    // 1. 데이터 존재 확인
    if(!baminID){
        return NextResponse.json({message: '아이디를 입력해주세요.', success: false});
    }

    // 2. 중복확인
    const bamin_account = await getBaminUserByID(baminID);
    if(bamin_account !== null){
        return NextResponse.json({message: '이미 존재하는 계정입니다.', success: false});
    }

    return NextResponse.json({success: true});
}