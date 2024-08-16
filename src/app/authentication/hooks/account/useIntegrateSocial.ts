import { signIn } from "next-auth/react";

const useIntegrateSocial = () => { 

    async function updateSocialID(social:string, socialID:string, mno:number) {
        const res = await fetch('/api/auth/social',{
            method: 'POST',
            body: JSON.stringify({mno: mno, social: social, socialID: socialID})
        });
        const data = await res.json()
        if(res.status === 200){
            alert('연동되었습니다.');
            signIn('kakao');
        }
    }

    return {
        updateSocialID,
    }
}

export default useIntegrateSocial;