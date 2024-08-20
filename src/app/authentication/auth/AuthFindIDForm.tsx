import CustomTextField from "@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField";
import RegisterFormProps from "@/app/(DashboardLayout)/components/forms/theme-elements/RegisterFormProps";
import { Box, Button, Paper, Typography } from "@mui/material";
import usePhone from "../hooks/step2/usePhone";
import { useState } from "react";
import Link from "next/link";

const AuthFindIDForm = ({formData, handleChange}: RegisterFormProps) => {
    const [result, setResult] = useState(null); // 회원 정보 찾기 결과

    const {
        handlePhoneChange,
    } = usePhone(handleChange) // 전화번호 관련 커스텀 훅

    function maskEmail(email:string) { // 이메일 마스킹
        const [user, domain] = email.split('@');
        const maskedUser = user[0]+user[1]+user[2] + '*'.repeat(user.length-3);
        return `${maskedUser}@${domain}`;
    }

    // 아이디 찾기 
    async function handleFindID(){
    
        const res = await fetch('/api/auth/find', {
          method: 'POST',
          body: JSON.stringify({
            type: 'ID',
            name: formData.name,
            phone: formData.phone,
          }),
        });

        const result = await res.json();
        if(!result.success){ // 실패
            alert(result.message);
        }else{ // 성공 시 아이디 보여주기
            setResult(result.user);
        }

    }

    return (
        <Box sx={{ mt: 3 }}>
            {result === null ? (
                <Box>
                    <Typography variant="h6">아이디 찾기</Typography>
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
                    <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleFindID}>
                        아이디 찾기
                    </Button>
                </Box>
            ) : (
                result.provider === 'credentials' ? (
                    <Box textAlign={"center"} mt={10}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            검색 결과 다음과 같습니다
                        </Typography>
                        <Paper elevation={6} sx={{ padding: 2, textAlign: 'center' }}>
                            <Typography variant="body1">
                                사용자 이메일: 
                            </Typography>
                            <Typography variant="body1">
                                <strong>{maskEmail(result.email)}</strong>
                            </Typography>
                            <Button variant="contained" color="primary" sx={{ mt: 2 }} LinkComponent={Link} href='/authentication/login'>
                                로그인
                            </Button>
                        </Paper>
                    </Box>
                ):
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

export default AuthFindIDForm;