// 아이디 비밀번호 찾기

import { changePasswordByMno, findUserByEmailAndNameAndPhone, findUserByNameAndPhone } from "@/services/AuthService";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    const body = await req.json();
    const {type, email, name, phone} = body;

    // 아이디 찾기
    if(type === 'ID'){
        console.log("아이디 찾기 = 이름 : ", name, " 전화번호 : ", phone);
        const data = {
            name: name,
            phone: phone,
        }
        // 검증
        if(!name || !phone){
            return NextResponse.json({message: "정보를 입력해주세요.", success: false})
        }

        // 통과 시 
        const user = await findUserByNameAndPhone(data);
        if(!user){
            return NextResponse.json({message: '일치하는 정보가 없습니다.', success: false});
        }else{
            return NextResponse.json({success: true, user: user});
        }   
    }

    // 비밀번호 찾기
    if(type === 'PW'){
        console.log("비밀번호 찾기 = 이메일 : " ,email ," 이름 : ", name, " 전화번호 : ", phone);
        const data = {
            email: email,
            name: name,
            phone: phone,
        }

        if(!email || !name || !phone){
            return NextResponse.json({message: "정보를 입력해주세요.", success: false})
        }

        // 통과 시 
        const user = await findUserByEmailAndNameAndPhone(data);

        if(!user){
            return NextResponse.json({message: '일치하는 정보가 없습니다.', success: false});
        }else{
            const userResult = {
                mno: Number(user.mno),
                email: user?.email,
                provider: user?.provider,
            }
            return NextResponse.json({success: true, user: userResult});
        }
    }

    return NextResponse.json({message: "잘못된 접근입니다.", success: false});
}

// 비밀번호 재설정
export async function PUT(req:NextRequest){
    const body = await req.json();
    const {mno, password, validPassword} = body;
    console.log("비밀번호 찾기 재설정 = mno : ", mno, " 비밀번호 : ", password, " 비밀번호 확인 : ", validPassword);

    // 검증 
    // 1. mno가 전달되지 않을경우
    if(!mno){
        return NextResponse.json({message: '잘못된 요청입니다.', success: false});
    }

    // 2. 비밀번호 정보가 전달되지 않은경우
    if(!password || !validPassword){
        return NextResponse.json({message: '정보를 입력해주세요.', success: false});
    }

    // 3. 비밀번호 형식이 올바르지 않은 경우
    const passRegex = /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[a-z\d!@#$%^&*]{8,}$/;
    if(!passRegex.test(password)){
        return NextResponse.json({message: "올바른 비밀번호 형식이 아닙니다.", success: false});
    }
    if(!passRegex.test(validPassword)){
        return NextResponse.json({message: "올바른 비밀번호확인 형식이 아닙니다.", success: false});
    }

    // 4. 비밀번호와 비밀번호 확인값이 일치하지 않은 경우
    if(password !== validPassword){
        return NextResponse.json({message: "비밀번호가 일치하지 않습니다.", success: false});
    }

    // 검증 통과 시
    const data = {
        mno: mno,
        password: password,
    }
    await changePasswordByMno(data); // 비밀번호 변경 메서드
        
    return NextResponse.json({message: "비밀번호가 성공적으로 변경되었습니다.", success: true});
}