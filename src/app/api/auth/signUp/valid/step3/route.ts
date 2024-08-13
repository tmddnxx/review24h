import { getBaminUserByID } from "@/services/BaminAuthService";
import { NextRequest, NextResponse } from "next/server";

// step 3 검증
export async function POST(req:NextRequest){
    const body = await req.json();
    const {baminID, baminPW, validBaminPW} = body;

    // 아이디 검증
    
    // 1. 아이디 존재여부
    if(!baminID){
        return NextResponse.json({message: "배달의 민족 아이디를 입력해주세요.", success: false});
    }

    // 2. 아이디 형식
    const regex = /^[a-zA-Z0-9]{4,20}$/;
    if(!regex.test(baminID)){
        return NextResponse.json({message: "올바른 아이디 형식이 아닙니다.", success: false});
    }
    
    // 3. 아이디 중복검사
    const account = await getBaminUserByID(baminID);
    if(account !== null){
        return NextResponse.json({message: "이미 사용중인 아이디입니다.", success: false});
    }

    // ----------------------------------------------------------------------------------
    // 비밀번호 검증

    // 1. 비밀번호 존재여부
    if(!baminPW){
        return NextResponse.json({message: "비밀번호를 입력해주세요.", success: false});
    }
    if(!validBaminPW){
        return NextResponse.json({message: "비밀번호 확인란을 입력해주세요.", success: false});
    }

    // 2. 비밀번호 형식 확인
    const passRegex = /^(?:(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{10,}|(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_])[a-zA-Z\d\W_]{8,})$/
    if(!passRegex.test(baminPW)){
        return NextResponse.json({message: "올바른 비밀번호 형식이 아닙니다.", success: false});
    }
    if(!passRegex.test(validBaminPW)){
        return NextResponse.json({message: "올바른 비밀번호확인 형식이 아닙니다.", success: false});
    }

    // 3. 비밀번호 일치 여부 확인
    if(baminPW !== validBaminPW){
        return NextResponse.json({message: "배달의 민족 비밀번호가 일치하지 않습니다.", success: false});
    }

    return NextResponse.json({success: true});
}