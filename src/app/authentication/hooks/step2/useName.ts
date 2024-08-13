import RegisterFormProps from "@/app/(DashboardLayout)/components/forms/theme-elements/RegisterFormProps";
import { useState } from "react";

const useName = (handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void, formdata: RegisterFormProps['formData']) => {
    const [nameErrMsg, setNameErrMsg] = useState('');
    const [isNameValid, setIsNameValid] = useState(false);

    const nameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {value} = e.target;
        handleChange({
            target: {
                id: 'name',
                value: value,
            }
        });

        if(!formatNameCheck(value)){
            setNameErrMsg('이름은 공백을 제외한 문자만 입력할 수 있습니다.')
            setIsNameValid(false); // 유효성검사 논패스
            return;
        }else{
            setNameErrMsg('');
            setIsNameValid(true); // 유효성검사 패스
        }

    }

    function formatNameCheck(name:string){
        const regex = /^[가-힣A-Za-z]+$/

        return regex.test(name);
    }


    return {
        nameChange,
        nameErrMsg,
        isNameValid,
    }
}

export default useName;