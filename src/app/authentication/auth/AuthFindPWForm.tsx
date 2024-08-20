import CustomTextField from "@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField";
import RegisterFormProps from "@/app/(DashboardLayout)/components/forms/theme-elements/RegisterFormProps";
import { Box, Button, Paper, Typography } from "@mui/material";
import { useState } from "react";
import usePhone from "../hooks/step2/usePhone";
import Link from "next/link";
import usePass from "../hooks/step2/usePass";
import PasswordVisibleIcon from "@/app/(DashboardLayout)/components/forms/theme-elements/PasswordVisibleIcon";
import useAccountData from "../hooks/account/useAccountData";
import { useRouter } from "next/navigation";

const AuthFindPWForm = ({formData, handleChange}: RegisterFormProps) => {
    const [result, setResult] = useState(null); // 회원 정보 찾기 결과
    const [mno, setMno] = useState(null); // 비밀번호 재설정 시 mno
    const [showPassword, setShowPassword] = useState(false); // 비밀번호 보여주기 
    const [showValidPassword, setValidShowPassword] = useState(false); // 비밀번호확인 보여주기

    const router = useRouter();
    
    // 비밀번호 보여주기 토글
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    // 비밀번호확인 보여주기 토글
    const toggleValidPasswordVisibility = () => {
        setValidShowPassword(!showValidPassword);
    };

    const {
        handlePhoneChange,
    } = usePhone(handleChange) // 전화번호 관련 커스텀 훅
    
    const {
        passChange,
        validPassChange,
        passErrMsg,
        validPassErrMsg,
        isPassValid, // 비밀번호 검사 패스/논패스
    } = usePass(handleChange, formData) // 패스워드 검증관련 커스텀 훅

    // 비밀번호 찾기 
    async function handleFindPW(){
    
        const res = await fetch('/api/auth/find', {
          method: 'POST',
          body: JSON.stringify({
            type: 'PW',
            email: formData.email,
            name: formData.name,
            phone: formData.phone,
          }),
        });

        const result = await res.json();
        if(!result.success){ // 실패
            alert(result.message);
        }else{ // 성공 시 비밀번호 재설정
            setResult(result.user);
            setMno(result.user.mno);
        }

    }

    // 비밀번호 재설정
    async function handleChangePW() {
        
        const res = await fetch('/api/auth/find', {
            method : 'PUT',
            body: JSON.stringify({
                mno: mno,
                password: formData.password,
                validPassword: formData.validPassword,
            })
        });

        const result = await res.json();
        if(!result.success){ // 실패
            alert(result.message);
        }else{
            alert(result.message);
            router.push('/authentication/login');
        }

    }


    return (
        <Box sx={{ mt: 3 }}>
            {result === null ? (
                <Box>
                    <Typography variant="h6">비밀번호 찾기</Typography>
                    <CustomTextField
                        label="이메일"
                        id="email"
                        fullWidth
                        margin="normal"
                        onChange={handleChange}
                    />
                    <CustomTextField
                        label="이름"
                        id="name"
                        fullWidth
                        margin="normal"
                        onChange={handleChange}
                    />
                    <CustomTextField
                        label="전화번호"
                        id="phone"
                        fullWidth
                        margin="normal"
                        value={formData.phone}
                        onChange={handlePhoneChange}
                    />
                    <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleFindPW}>
                        비밀번호 찾기
                    </Button>
                </Box>
            ) : (
                result.provider === 'credentials' ? (
                    <Box textAlign={"center"} mt={10}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            비밀번호를 재설정 해주세요.
                        </Typography>
                        <Paper elevation={6} sx={{ padding: 2, textAlign: 'center' }}>
                            <CustomTextField id="password" margin="normal" label="새 비밀번호" type={showPassword ? 'text' : 'password'} onChange={passChange} variant="outlined" fullWidth placeholder="비밀번호는 8자 이상 영어,숫자,특수문자를 모두 포함하셔야합니다."
                            InputProps={{
                            endAdornment: (
                                <PasswordVisibleIcon
                                showPassword={showPassword}
                                onToggle={togglePasswordVisibility}
                                />
                            )
                            }}
                            />
                            <Typography variant='caption' color="red">{passErrMsg}</Typography>

                            <CustomTextField id="validPassword" margin="normal" label="새 비밀번호 확인" type={showValidPassword ? 'text' : 'password'} onChange={validPassChange} variant="outlined" fullWidth placeholder="비밀번호는 8자 이상 영어,숫자,특수문자를 모두 포함하셔야합니다."
                            InputProps={{
                            endAdornment: (
                                <PasswordVisibleIcon
                                showPassword={showValidPassword}
                                onToggle={toggleValidPasswordVisibility}
                                />
                            )
                            }}
                            />
                            <Typography variant='caption' color="red">{validPassErrMsg}</Typography>

                            <Box sx={{textAlign: 'right', mt:1}}>
                                <Button variant='contained' size='medium' disabled={!isPassValid} onClick={handleChangePW}>확인</Button>
                            </Box>
                        </Paper>
                    </Box>
                ) :
                (
                    <Box textAlign={"center"} mt={10}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            검색 결과 다음과 같습니다
                        </Typography>
                        <Paper elevation={6} sx={{ padding: 2, textAlign: 'center' }}>
                            <Typography variant="body1">
                                <strong>{result.provider}</strong>로 가입된 회원입니다.
                            </Typography>
                            <Typography variant="body1">
                                <strong>{result.provider}</strong>로 로그인 해주세요.
                            </Typography>
                            <Button variant="contained" color="primary" sx={{ mt: 2 }} LinkComponent={Link} href='/authentication/login'>
                                로그인
                            </Button>
                        </Paper>
                    </Box>
                )
            )}
        </Box>
    )
}

export default AuthFindPWForm;