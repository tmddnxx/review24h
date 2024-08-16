// 유저 id에 따른 정보 api

import { changePasswordByMno, getUserAndBaminByMno, getUserByMno } from "@/services/AuthService";
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

export async function PUT(req:NextRequest, {params} : { params: {mno:number}}){
    const body = await req.json();
    const {password, validPassword} = body;
    const accessToken = req.headers.get('authorization');
    const mno = params.mno;
    const data = {
        mno: mno,
        password: body.password,
    }

    console.log("PUT BODY? : ", body);

    // 토큰이 전달되지않음
    if(!accessToken){
        return NextResponse.json({message: "액세스토큰이 존재하지 않습니다.", success: false});
    }

    // 토큰이 유효하지 않음
    if(!verifyJwt(accessToken)){
        return NextResponse.json({message: "액세스토큰이 유효하지 않습니다.", success: false});
    }

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

    await changePasswordByMno(data); // 비밀번호 변경 메서드
    
    return NextResponse.json({message: "비밀번호가 성공적으로 변경되었습니다.", success: true});
}