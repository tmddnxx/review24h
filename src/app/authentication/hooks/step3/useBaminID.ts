import RegisterFormProps from "@/app/(DashboardLayout)/components/forms/theme-elements/RegisterFormProps";
import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";

const useBaminID = (handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void, formdata: RegisterFormProps['formData']) => {
    const [isBaminDuplicateCheck, setIsBaminDuplicateCheck] = useState(false); // 배민아이디 중복확인
    const [baminIDErrMsg, setBaminIDErrMsg] = useState(''); // 에러메시지
    const [isBaminIDFormatValid, setIsBaminIDFormatValid] = useState(false);
    const [isBaminIDValid, setIsBaminIDValid] = useState(false); // 배민아이디 유효성 검사 통과 여부

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
            setIsBaminIDFormatValid(false); // 형식 미통과
        }else{
            setBaminIDErrMsg('');
            setIsBaminIDFormatValid(true); // 형식 통과
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
            console.log("중복검사 실행");
            if(!baminID){
                setBaminIDErrMsg('아이디를 입력해주세요');
                setIsBaminDuplicateCheck(false);
                
            }
            const res = await fetch('/api/auth/signUp/valid/step3/baminID',{
                method: 'POST',
                body: JSON.stringify({baminID: baminID})
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

    useEffect(() => {
        // 아이디 형식이 맞고, 중복되지 않았을때만 isBaminValid를 true로 설정
        if(isBaminIDFormatValid && isBaminDuplicateCheck){
            setIsBaminIDValid(true);
        }else{
            setIsBaminIDValid(false);
        }
    },
    [isBaminIDFormatValid, isBaminDuplicateCheck]);


    return {
        isBaminIDValid,
        baminIDErrMsg,
        baminIDChange,
    }
}

export default useBaminID;