import { getUserByEmail } from "@/services/AuthService";
import { NextRequest, NextResponse } from "next/server";
import redis from "../../../../../../../redis/redis";

// STEP 2 전체 검증
export async function POST(req:NextRequest){
    const body = await req.json();
    const { email, code, password, validPassword, name, phone } = body;


    // 이메일 검증
    
    // 1. 이메일 존재여부
    if(!email){
        return NextResponse.json({message: "이메일을 입력해주세요.", success: false});
    }

    // 2. 이메일 형식
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)){
        return NextResponse.json({message: "올바른 이메일 형식이 아닙니다.", success: false});
    }

    // 3. 이메일 중복검사
    const user = await getUserByEmail(email);
    if(user !== null){
        return NextResponse.json({message: "이미 사용중인 이메일입니다.", success: false});
    }

    // 4. 이메일 인증코드 확인
    const redisCode = await redis.get(`code:${email}`);
    if(!redisCode){
        return NextResponse.json({message: "이메일 인증을 진행해주세요.", success: false});
    }
    
    // 5. 인증코드 일치여부 확인
    if(code !== redisCode){
        return NextResponse.json({message: "인증코드를 확인해주세요.", success: false});
    }

    // 6. 인증코드 만료여부 확인
    const codeEXP = await redis.ttl(`code:${email}`);
    const currentTime = Date.now();
    if(codeEXP - currentTime <= 0){
        return NextResponse.json({message: "인증코드 유효시간이 만료되었습니다.", success: false});
    }

    // -------------------------------------------------------------------------------------
    // 비밀번호 검증

    // 1. 비밀번호 존재여부
    if(!password){
        return NextResponse.json({message: "비밀번호를 입력해주세요.", success: false});
    }
    if(!validPassword){
        return NextResponse.json({message: "비밀번호 확인란을 입력해주세요.", success: false});
    }

    // 2. 비밀번호 형식 확인
    const passRegex = /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[a-z\d!@#$%^&*]{8,}$/;
    if(!passRegex.test(password)){
        return NextResponse.json({message: "올바른 비밀번호 형식이 아닙니다.", success: false});
    }
    if(!passRegex.test(validPassword)){
        return NextResponse.json({message: "올바른 비밀번호확인 형식이 아닙니다.", success: false});
    }

    // 3. 비밀번호 - 비밀번호확인 일치여부
    if(password !== validPassword){
        return NextResponse.json({message: "비밀번호가 일치하지 않습니다.", success: false});
    }

    // -------------------------------------------------------------------------------------
    // 이름 검증

    // 1. 이름 존재여부
    if(!name){
        return NextResponse.json({message: "이름을 입력해주세요.", success: false});
    }

    // 2. 이름 형식여부
    const nameRegex = /^[가-힣A-Za-z]+$/;
    if(!nameRegex.test(name)){
        return NextResponse.json({message: "이름은 공백을 제외한 문자만 입력할 수 있습니다.", success: false});
    }

    // -------------------------------------------------------------------------------------
    // 전화번호 검증

    // 1. 전화번호 존재여부
    if(!phone){
        return NextResponse.json({message: "전화번호를 입력해주세요.", success: false});
    }
    
    // 전화번호 추가 검증 해야함

    return NextResponse.json({success: true});
}