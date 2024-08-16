import { NextRequest, NextResponse } from "next/server";
import { signJwtAccessToken, verifyJwt } from "@/utils/auth/jwt";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { getUserByMno } from "@/services/AuthService";
import redis from "../../../../../redis/redis";


export async function POST(req:NextRequest) {
    const accessToken = req.headers.get('authorization');
    console.log("header accessToken ? ",accessToken);

    if(!accessToken){
        // 엑세스토큰이 제공되지 않은 경우
        return new NextResponse(JSON.stringify({message: "엑세스토큰이 제공되지 않았습니다."}),{status : 400})
    }

    const verifyAT = verifyJwt(accessToken);
    const at_ex = jwtDecode(accessToken).exp;
    const currentTime = Math.floor(Date.now() / 1000 ); 

    if(at_ex-currentTime <= 0){ // 액세스토큰 만료된 경우
        return new NextResponse(JSON.stringify({message: "액세스토큰이 만료되었습니다."}), {status : 401})
    }

    if(!verifyAT){
        // 엑세스토큰이 유효하지 않은 경우
        return new NextResponse(JSON.stringify({message: "엑세스토큰이 유효하지 않습니다."}), {status: 401})
    }

    const cookie = cookies();
    const refreshToken = cookie.get('refreshToken');
    const refreshTokenString = (refreshToken as { value: string })?.value || '';

    const rt_ex = jwtDecode(refreshTokenString).exp;

    if((rt_ex-currentTime) <= 0){
        // 쿠키 리프레시토큰이 만료된 경우
        return new NextResponse(JSON.stringify({message: "리프레시토큰 만료되었습니다."}), {status : 401})
    }
        

    const verifyRT = verifyJwt(refreshTokenString);
   
    if(!verifyRT){
        // 쿠키 리프레시토큰이 유효하지 않은 경우
        return new NextResponse(JSON.stringify({message: "리프레시토큰이 유효하지 않습니다."}),{status: 401})
    }
    
    // 레디스 토큰 확인
    const redisBlackRT = await redis.get(`blackList:${refreshToken?.value}`);
    if(redisBlackRT === 'blackList'){
        // 블랙리스트에 등록된 토큰인지 확인
        return new NextResponse(JSON.stringify({message: "블랙리스트에 등록된 토큰입니다."}),{status: 403})
    }

    const at_mno = Number(jwtDecode(accessToken).mno);
    const rt_mno = jwtDecode(refreshTokenString).mno;

    const redisRT = await redis.get(`refreshToken:mno:${rt_mno}`);

    if(redisRT !== refreshTokenString){
        // Redis 토큰과 쿠키토큰 미 일치 경우
        return new NextResponse(JSON.stringify({message: "토큰이 일치하지 않습니다."}), {status:401})
    }
    
    const decodeRedisRT = jwtDecode(redisRT);

    if(at_mno !== decodeRedisRT.mno){
        // 액세스토큰의 mno와 리프레시토큰의 mno가 동일하지 않은 경우
        return new NextResponse(JSON.stringify({message: "사용자가 일치하지 않습니다."}), {status: 401})
    }
    
    
    const user = await getUserByMno(decodeRedisRT.mno);
    const mno = Number(user?.mno);
    const newAccessToken = signJwtAccessToken({mno: mno});
    console.log("new AT ? " , newAccessToken);

    return NextResponse.json({accessToken: newAccessToken})
}



