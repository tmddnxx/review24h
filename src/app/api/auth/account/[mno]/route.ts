// 유저 id에 따른 정보 api

import { getUserAndBaminByMno, getUserByMno } from "@/services/AuthService";
import { getBaminUserByMno } from "@/services/BaminAuthService";
import { verifyJwt } from "@/utils/auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import CryptoJS from "crypto-js";

export async function GET(req:NextRequest, {params} : { params: {mno:number}} ) {
    const accessToken = req.headers.get('authorization');
    const mno = params.mno;

    // 토큰이 전달되지않음
    if(!accessToken){
        return NextResponse.json({message: "액세스토큰이 존재하지 않습니다.", data: false});
    }

    // 토큰이 유효하지 않음
    if(!verifyJwt(accessToken)){
        return NextResponse.json({message: "액세스토큰이 유효하지 않습니다.", data: false});
    }

    // 사용자&배민 정보 반환
    const user = await getUserAndBaminByMno(mno);
    
    if(!user){
        return NextResponse.json({message: "정보가 없습니다.", data: false});
    }

    const baminID = CryptoJS.AES.decrypt(user.bamin_account?.baminID, process.env.NEXTAUTH_SECRET).toString(CryptoJS.enc.Utf8);
    
    const userData = {
        mno: Number(user?.mno),
        email: user.email,
        password: user.password,
        name: user.name,
        phone: user.phone,
        provider: user.provider,
        socialID: user.socialID,
        baminID: baminID,
        baminPW: user.bamin_account?.baminPW,
    }
    

    console.log("MyAccount 유저 반환 : " , userData);

    return NextResponse.json({message: "유저정보 전달완료", data: true, result: userData});
}