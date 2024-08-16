import prisma from "../../prisma/client";
import bcrypt from 'bcrypt';

export async function getBaminUserByID(baminID:string){
    
    const bamin_account = await prisma.bamin_account.findMany(); // 전체를 조회

    for(const account of bamin_account){ // 파라미터와 일치하는 아이디 찾기
        const isMatch = await bcrypt.compare(baminID, account.baminID)
        if(isMatch){
            return account;
        }
    }

    return null;
}

export async function getBaminUserByMno(mno:number){

    const bamin_account = await prisma.bamin_account.findUnique({
        where: {
            mno: mno,
        }
    })

    if(!bamin_account){ // // 없으면 null 반환
        return null;
    }

    
    return bamin_account;
}