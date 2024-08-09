// 회원가입 로그인 관련 서비스
import prisma from "../../prisma/client";
import * as bcrypt from 'bcrypt';

// 회원가입
export async function signUp(body:any){
    try {
        const hashedPW = await bcrypt.hash(body.password, 10); // 10 => 해시반복횟수
        const hashedBPW = await bcrypt.hash(body.baminPW, 10); // 10 => 해시반복횟수
        const result = await prisma.$transaction(async (prisma) => {
            const user = await prisma.user.create({
                data: {
                    email: body.email,
                    password: hashedPW, 
                    name: body.name,
                    phone: body.phone,
                    social: body.social,
                }
            });

            const baminAccount = await prisma.bamin_account.create({
                data: {
                    mno: user.mno,
                    baminID: body.baminID,
                    baminPW: hashedBPW,
                }
            });
        });

        return true;
    } catch (error) {
        // 에러를 발생시켜 상위로 전달
        console.error('Error in signUp function:', error); // 오류 로그 추가
       return error as Error
    }
}

// 로그인
export async function signIn(body:any){
    try{
        const email = body.email;
        const result = await prisma.user.findUnique({
            where: {
                email: email
            }
        })

        if(result === null){ // 아이디가 없으면 null
            return null;
        }
        
        const passwordMatch = await bcrypt.compare(body.password, result.password);
        if(passwordMatch){ // 비밀번호 일치하면
            const {password, ...userWithoutPass } = result
            const user = {
                ...userWithoutPass,
                mno: userWithoutPass.mno.toString(),
            }
            return user; // 비밀번호 제외한 user를 반환
        }else{
            return null;
        }        
    } catch(error){
        
    }
}

// 식별자로 유저찾기
export async function getUserByMno(mno:number){
    const user = await prisma.user.findUnique({
        where: {
            mno: mno,
        }
    })
    if(user !== null){
        const {password, ...userWithoutPass} = user;
        return userWithoutPass;
    }else{
        return null;
    }
    
}

// 이메일로 유저찾기
export async function getUserByEmail(email:string){
    const user = await prisma.user.findUnique({
        where : {
            email: email,
        }
    })
    if(user !== null){
        const {password, ...userWithoutPass} = user;

        return userWithoutPass;
    }else{
        return null;
    }
}

// 전화번호로 유저찾기
export async function getUserByPhone(phone:string){
    const user = await prisma.user.findUnique({
        where : {
            phone: phone,
        }
    })
    if(user !== null){
        const {password, ...userWithoutPass} = user;

        return userWithoutPass;
    }else{
        return null;
    }
}