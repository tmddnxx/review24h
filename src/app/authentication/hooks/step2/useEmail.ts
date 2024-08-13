// hooks/useAuth.ts
import RegisterFormProps from '@/app/(DashboardLayout)/components/forms/theme-elements/RegisterFormProps';
import { useState, useEffect } from 'react';

const useEmail = (handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void, formdata: RegisterFormProps['formData']) => {
    const [isDuplicateChecked, setIsDuplicateChecked] = useState(false); // true면 중복검사 통과, false면 비통과
    const [isSendEmail, setSendEmail] = useState(false); // 인증메일 보냈는지 
    const [isConfirmCode, setConfirmCode] = useState(false); // 인증코드 확인했는지
    const [remainingTime, setRemainingTime] = useState('00:00'); // 인증코드 남은시간 표시
    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null); // 타이머 저장
    const [emailErrMsg, setEmailErrMsg] = useState(''); // 유효성검사 에러메세지

    // 이메일 변경 감지
    const emailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        handleChange({ target: { 
            id: 'email', 
            value: value,
        }});
        setIsDuplicateChecked(false); // 중복확인 다시
        setSendEmail(false); // 메일인증 다시
        setConfirmCode(false); // 코드확인 다시
        if(!formatEmailCheck()){
            setEmailErrMsg('올바른 이메일 형식이 아닙니다.');
        }else{
            setEmailErrMsg('');
        }
    };

    // 이메일 형식검사
    function formatEmailCheck() {
        const email = formdata.email;
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        return regex.test(email);
    }


    // 이메일 중복검사
    const handleDuplicateCheck = async () => {
        const email = formdata.email;
        const data = { 
            action: 'checkDuplicate',
            email: email 
        };
        const res = await fetch('/api/auth/signUp/valid/step2/email', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' },
        });
        const result = await res.json();

        if (result.data) {
            alert(result.message);
            setIsDuplicateChecked(true);
            
        } else {
            alert(result.message);
            setIsDuplicateChecked(false);
        }
    };

    // 인증 메일 전송 
    const sendEmailCode = async () => {
        const email = formdata.email;
        const data = { 
            action: 'sendEmail',
            email: email 
        };
        const res = await fetch('/api/auth/signUp/valid/step2/email', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' },
        });
        const result = await res.json();

        if (result.data) {
            alert(result.message);
            const currentTime = Date.now();
            const exp = result.exp - currentTime;
            const remainEXP = Math.floor(exp / 1000);
            setRemainingTime(formatTime(remainEXP)); // 남은시간 확인
            startCountdown(remainEXP); // 시간 카운트다운
            setSendEmail(true); // 이메일 전송여부 true
            setConfirmCode(false); // 인증코드 확인여부 false(보여줌)
        } else {
            alert(result.message);
            setSendEmail(false);
            setConfirmCode(false); // 인증코드 확인여부 false(보여줌)
            return;
        }
    };

    const codeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        handleChange({ target: { 
            id: 'code', 
            value: value,
        }});
    };

    // 인증코드 확인
    const confirmCode = async() => {
        const eamil = formdata.email;
        const data = {  
            action: 'confirmCode',
            email: eamil,
            code: formdata.code,
        };
        const res = await fetch('/api/auth/signUp/valid/step2/email', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' },
        });
        const result = await res.json();

        if(result.data){ // 인증성공
            alert(result.message);
            setConfirmCode(true); // 인증완료 (버튼숨김)
            setRemainingTime(''); // 타이머 초기화
            clearInterval(timer); // 타이머 삭제
            
        }else{ // 인증실패
            alert(result.message);
            setConfirmCode(false); // 인증코드 확인여부 false(보여줌)
            return;
        }
    }


    // 시간 변환
    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    };

    // 남은 시간을 업데이트하는 함수
    const startCountdown = (initialSeconds: number) => {
        let totalSeconds = initialSeconds; // 남은 시간(초)
        if (timer) clearInterval(timer); // 이전 타이머 클리어

        const newTimer = setInterval(() => {
            totalSeconds -= 1; // 1초씩 감소
            if (totalSeconds <= 0) {
                clearInterval(newTimer); // 타이머 멈춤
                setRemainingTime('00:00'); // 남은 시간 표시
            } else {
                setRemainingTime(formatTime(totalSeconds)); // 남은 시간 업데이트
            }
        }, 1000);

        setTimer(newTimer); // 새 타이머 저장
    };

    // 컴포넌트가 언마운트될 때 타이머 클리어
    useEffect(() => {
        return () => {
            if (timer) clearInterval(timer);
        };
    }, [timer]);

    return {
        isDuplicateChecked,
        isSendEmail,
        isConfirmCode,
        remainingTime,
        emailErrMsg,
        
        codeChange,
        emailChange,
        handleDuplicateCheck,
        sendEmailCode,
        confirmCode,
    };
};

export default useEmail;
