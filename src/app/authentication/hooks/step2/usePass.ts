import RegisterFormProps from "@/app/(DashboardLayout)/components/forms/theme-elements/RegisterFormProps";
import { useState } from "react";

const usePass = (handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void, formdata: RegisterFormProps['formData']) => {
    const [passErrMsg, setPassErrMsg] = useState(''); // 비밀번호 오류메시지
    const [validPassErrMsg, setValidPassErrMsg] = useState(''); // 비밀번호 확인란 오류메시지
    const [isPassVaild, setIsPassValid] = useState(false); // 비밀번호 검증 통과여부

    
    // 비밀번호 변경감지
    const passChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {value} = e.target;
        handleChange({
            target: {
                id: 'password',
                value: value,
            }
        });
        if(!formatPassCheck(value)){
            setPassErrMsg('비밀번호는 8자 이상 영어,숫자,특수문자를 모두 포함하셔야합니다.');
            setIsPassValid(false); // 유효성검사 논패스
        }else{
            setPassErrMsg('');
            setIsPassValid(true); // 유효성검사 패스
        }

    }

    // 비밀번호 확인란 변경 감지
    const validPassChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {value} = e.target;
        const password = formdata.password;
        
        handleChange({
            target: {
                id: 'validPassword',
                value: value,
            }
        });
        if(!formatPassCheck(value)){
            setValidPassErrMsg('비밀번호는 8자 이상 영어,숫자,특수문자를 모두 포함하셔야합니다.');
            setIsPassValid(false); // 유효성검사 논패스
            return;
        }else{
            setValidPassErrMsg('');
            setIsPassValid(true); // 유효성검사 패스
        }
        checkPassMatch(password, value); // 비밀번호 일치확인

    }

    // 비밀번호 형식 검사
    function formatPassCheck(password: string){
        const regex = /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[a-z\d!@#$%^&*]{8,}$/

        return regex.test(password);
    }

    //비밀번호 일치 확인
    function checkPassMatch(pass:string, validPass:string){
        if(pass !== validPass){
            setValidPassErrMsg('비밀번호가 일치하지 않습니다.')
            setIsPassValid(false); // 유효성검사 논패스
        }else{
            setValidPassErrMsg('');
            setIsPassValid(true); // 유효성검사 패스
        }
    }



    return {
        passChange,
        validPassChange,
        passErrMsg,
        validPassErrMsg,
        isPassVaild,
    }
}

export default usePass;