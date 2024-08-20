import prisma from "../../prisma/client";
import CryptoJS from "crypto-js";
import bcrypt from 'bcrypt';

export async function getBaminUserByID(baminID:string){
    
    const bamin_account = await prisma.bamin_account.findMany(); // 전체를 조회

    for(const account of bamin_account){ // 파라미터와 일치하는 아이디 찾기
        const decryptBaminID = CryptoJS.AES.decrypt(account.baminID, process.env.NEXTAUTH_SECRET).toString(CryptoJS.enc.Utf8)
        
        if(decryptBaminID === baminID){
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

export async function changeBaminIDByMno(body:any) {

    const encryptBID = CryptoJS.AES.encrypt(body.baminID, process.env.NEXTAUTH_SECRET).toString();

    await prisma.bamin_account.update({
        where: {
            mno: body.mno,
        },
        data: {
            baminID: encryptBID,
        }
    })
}

export async function changeBaminPWByMno(body:any) {
    const hashedBPW = await bcrypt.hash(body.baminPW, 10); 

    await prisma.bamin_account.update({
        where: {
            mno: body.mno,
        },
        data: {
            baminPW: hashedBPW,
        }
    })
}