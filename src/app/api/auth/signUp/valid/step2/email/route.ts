import { getUserByEmail } from "@/services/AuthService";
import { sendEmail } from "@/utils/auth/mail";
import { NextRequest, NextResponse } from "next/server";
import redis from "../../../../../../../../redis/redis";

// step 2 검증
export async function POST(req: NextRequest){
    const body = await req.json();

    console.log("이메일 ", body.email);
    const user = await getUserByEmail(body.email);

    // 이메일 존재여부확인
    if(!body.email){
        return NextResponse.json({message: "이메일을 입력해주세요.", data: false})
    }

    // 이메일 중복체크
    if(body.action === 'checkDuplicate'){
        if(user !== null){
            return NextResponse.json({message: "이미 사용중인 이메일입니다.", data: false})
        }else{
            return NextResponse.json({message: "사용가능한 이메일입니다.", data: true})
        }
    }
    // 이메일 인증메일 보내기
    else if(body.action === 'sendEmail'){
        try {
            const {code, exp} = await sendEmail(body.email);
            console.log("이메일 인증 코드 : ", code);
            return NextResponse.json({ message: "메일 전송 완료.", code, exp, data: true });
        } catch (error) {
            return NextResponse.json({ message: error.message, data: false });
        }
    }
    // 이메일 인증코드 확인하기
    else if(body.action ==='confirmCode'){
        const redisCode = await redis.get(`code:${body.email}`);
        
        // 인증코드 일치여부
        console.log("code? ", body.code);
        console.log("code? ", redisCode);
        if(body.code !== redisCode){
            return NextResponse.json({message: "인증코드가 일치하지 않습니다.", data: false});
        }

        const codeEXP = await redis.ttl(`code:${body.email}`);
        const currentTime = Date.now();

        // 인증코드 만료여부
        if(codeEXP - currentTime <= 0){
            return NextResponse.json({message: "인증코드 유효시간이 만료되었습니다.", data: false});
        }

        return NextResponse.json({message: "인증되셨습니다.", data:true});
    }
        

}