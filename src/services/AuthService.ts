// 회원가입 로그인 관련 서비스
import prisma from "../../prisma/client";
import * as bcrypt from 'bcrypt';
import CryptoJS from "crypto-js";

// 회원가입
export async function signUp(body:any){
    try {
        const hashedPW = await bcrypt.hash(body.password, 10); // 10 => 해시반복횟수
        const hashedBID = CryptoJS.AES.encrypt(body.baminID, process.env.NEXTAUTH_SECRET).toString()
        const hashedBPW = await bcrypt.hash(body.baminPW, 10); // 10 => 해시반복횟수
        
        const result = await prisma.$transaction(async (prisma) => {
            const user = await prisma.user.create({
                data: {
                    email: body.email,
                    password: hashedPW, 
                    name: body.name,
                    phone: body.phone,
                    provider: body.provider,
                }
            });

            const baminAccount = await prisma.bamin_account.create({
                data: {
                    mno: user.mno,
                    baminID: hashedBID,
                    baminPW: hashedBPW,
                }
            });

            const social = await prisma.social.create({
                data: {
                    mno: user.mno,
                    kakao_Id: body.provider === 'kakao' ? body.socialID : '',
                    naver_Id: body.provider === 'naver' ? body.socialID : ''
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
        
        return user;
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

// 소셜 아이디로 유저찾기
export async function getUserBySocialID(provider:string ,socialID:string){
    
    const user = await prisma.user.findFirst({
        where: {
            social: {
                ...(provider === 'kakao' ? { kakao_Id: socialID } : {}),
                ...(provider === 'naver' ? { naver_Id: socialID } : {}),
            },
        },
        include: {
            social: true,
        },
    });
    
    if(!user){
        return null
    }

    return user;
}

// User + Bamin 테이블 조인
export async function getUserAndBaminByMno(mno:number){

    const result = await prisma.user.findUnique({
        where: {
            mno:mno,
        },
        include: {
            bamin_account: true,
        }
    })

    if(!result){
        return null;
    }

    return result;
}

// User 정보 업데이트
export async function updateUserByMno(body:any){
    await prisma.user.update({
        where: {
            mno: body.mno,
        },
        data: {
            email: body.email,
            name: body.name,
            phone: body.phone,
        }
    })
}

// 소셜ID 연동
export async function updateSocialID(mno:number, social:string, socialID: string){
    
      // 데이터 업데이트에 사용할 객체를 생성합니다.
      let updateData: any = {};

      // provider에 따라 업데이트할 필드를 설정합니다.
      if (social === 'kakao') {
          updateData = {
              kakao_Id: socialID,
          };
      } else if (social === 'naver') {
          updateData = {
              naver_Id: socialID,
          };
      }
  
      // 소셜ID 업데이트
      await prisma.social.update({
          where: {
              mno: mno, // 업데이트할 레코드의 식별자로 mno를 사용합니다.
          },
          data: {
              ...updateData, // 업데이트할 데이터를 스프레드 연산자로 추가합니다.
          },
      });
}

// 회원 비밀번호 변경
export async function changePasswordByMno(body:any){
    const hashedPassword = await bcrypt.hash(body.password, 10);
    await prisma.user.update({
        where: {
            mno: body.mno,
        },
        data: {
            password: hashedPassword,
        }
    })
}