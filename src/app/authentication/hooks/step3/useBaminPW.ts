import RegisterFormProps from "@/app/(DashboardLayout)/components/forms/theme-elements/RegisterFormProps";
import { useState } from "react";

const useBaminPW = (handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void, formdata: RegisterFormProps['formData']) => {
    const [baminPWErrMsg, setBaminPWErrMsg] = useState(''); // 비밀번호 오류메시지
    const [validBaminPWErrMsg, setValidBaminPWErrMsg] = useState(''); // 비밀번호 확인란 오류메시지
    const [isBaminPWValid, setIsBaminPWValid] = useState(false); // 비밀번호 검증 통과여부

    // 배민 비밀번호 변경감지
    const baminPWChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {value} = e.target;
        handleChange({
            target: {
                id: 'baminPW',
                value: value,
            }
        });

        if(!formatBaminPWCheck(value)){
            setBaminPWErrMsg('비밀번호는 영문+숫자 10자 이상 또는 영문+숫자+특수기호 8자 이상이어야 합니다.');
            setIsBaminPWValid(false); // 검증 논패스
        }else{
            setBaminPWErrMsg('');
            setIsBaminPWValid(true); // 검증 패스
        }

    }

    // 배민 비밀번호 확인란 변경감지
    const validBaminPWChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {value} = e.target;
        const baminPW = formdata.baminPW;

        handleChange({
            target: {
                id: 'validBaminPW',
                value: value,
            }
        });

        if(!formatBaminPWCheck(value)){
            setValidBaminPWErrMsg('비밀번호는 영문+숫자 10자 이상 또는 영문+숫자+특수기호 8자 이상이어야 합니다.');
            setIsBaminPWValid(false); // 검증 논패스
        }else{
            setValidBaminPWErrMsg('');
            setIsBaminPWValid(true); // 검증 패스
        }

        checkBaminPWMatch(baminPW, value); // 비밀번호 일치확인
    }

    // 배민 비밀번호 형식 검사
    function formatBaminPWCheck(password: string){
        const regex = /^(?:(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{10,}|(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_])[a-zA-Z\d\W_]{8,})$/
        return regex.test(password);
    }

    // 배민 비밀번호 일치 확인
    function checkBaminPWMatch(pass:string, validPass:string){
        if(pass !== validPass){
            setValidBaminPWErrMsg('비밀번호가 일치하지 않습니다.');
            setIsBaminPWValid(false); // 검증 논패스
        }else{
            setValidBaminPWErrMsg('');
            setIsBaminPWValid(true); // 검증 패스
        }
    }


    return {
        baminPWErrMsg,
        validBaminPWErrMsg,
        isBaminPWValid,
        baminPWChange,
        validBaminPWChange
    }

    
}

export default useBaminPW;