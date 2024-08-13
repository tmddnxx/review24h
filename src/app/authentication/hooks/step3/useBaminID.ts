import RegisterFormProps from "@/app/(DashboardLayout)/components/forms/theme-elements/RegisterFormProps";
import { debounce } from "lodash";
import { useCallback, useState } from "react";

const useBaminID = (handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void, formdata: RegisterFormProps['formData']) => {
    const [isBaminDuplicateCheck, setIsBaminDuplicateCheck] = useState(false); // 배민아이디 중복확인
    const [baminIDErrMsg, setBaminIDErrMsg] = useState(''); // 에러메시지
    

    // 배민아이디 변경 감지
    const baminIDChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {value} = e.target;
        handleChange({
            target: {
                id: 'baminID',
                value: value,
            }
        });

        if(!foramtBaminIDCheck()){
            setBaminIDErrMsg('올바른 아이디 형식이 아닙니다.');
            setIsBaminDuplicateCheck(false);
        }else{
            setBaminIDErrMsg('');
            handleDuplicateCheck(value); // debounce 중복검사
        }

    }
    
    // 배민아이디 형식검사
    function foramtBaminIDCheck(){
        const baminID = formdata.baminID;
        const regex = /^[a-zA-Z0-9]{4,20}$/

        return regex.test(baminID);
    }

    // 배민아이디 중복검사 (debounc - 500ms(0.5초)동안 입력 없을 시 요청)
    const handleDuplicateCheck = useCallback(
        debounce(async (baminID:string) => {
            console.log(baminID);
            if(!baminID){
                setBaminIDErrMsg('아이디를 입력해주세요');
                setIsBaminDuplicateCheck(false);
                
            }
            const res = await fetch('/api/auth/signUp/valid/step3/baminID',{
                method: 'POST',
                body: JSON.stringify({baminID})
            });
            const result = await res.json();

            if(!result.success){
                setIsBaminDuplicateCheck(false);
                setBaminIDErrMsg(result.message);
            }else{
                setIsBaminDuplicateCheck(true);
                setBaminIDErrMsg('');
            }
        }, 500),
        []
    );

    return {
        isBaminDuplicateCheck,
        baminIDErrMsg,
        baminIDChange,
    }
}

export default useBaminID;