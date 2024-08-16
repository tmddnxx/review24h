import RegisterFormProps from "@/app/(DashboardLayout)/components/forms/theme-elements/RegisterFormProps";
import { useEffect, useState } from "react";

const usePass = (handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void, formdata: RegisterFormProps['formData']) => {
    const [passErrMsg, setPassErrMsg] = useState(''); // 비밀번호 오류메시지
    const [validPassErrMsg, setValidPassErrMsg] = useState(''); // 비밀번호 확인란 오류메시지
    const [isPassValid, setIsPassValid] = useState(false); // 비밀번호 검증 통과여부
    const [isPassFormatValid, setIsPassFormatValid] = useState(false); // 비밀번호 형식 유효성
    const [isPassMatch, setIsPassMatch] = useState(false); // 비밀번호 일치 여부
    
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
            setIsPassFormatValid(false); // 형식 미통과
        }else{
            setPassErrMsg('');
            setIsPassFormatValid(true); // 형식 통과
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
            setIsPassFormatValid(false); // 형식 미통과
           
        }else{
            setValidPassErrMsg('');
            setIsPassFormatValid(true); // 형식 통과
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
            setIsPassMatch(false); // 비밀번호가 일치하지 않으면 false
        }else{
            setValidPassErrMsg('');
            setIsPassMatch(true); // 비밀번호가 일치하지 않으면 true
        }
    }

    // 유효성 검사 통과 여부
    useEffect(() => {
        // 비밀번호 형식이 맞고, 두 비밀번호가 일치할 때만 isPassValid를 true로 설정
        if (isPassFormatValid && isPassMatch) {
            setIsPassValid(true);
        } else {
            setIsPassValid(false);
        }
    }, 
    [isPassFormatValid, isPassMatch]); // 형식 유효성 및 비밀번호 일치 여부가 변경될 때마다 검사



    return {
        passChange,
        validPassChange,
        passErrMsg,
        validPassErrMsg,
        isPassValid,
    }
}

export default usePass;