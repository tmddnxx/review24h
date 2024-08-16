import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import RegisterFormProps from '@/app/(DashboardLayout)/components/forms/theme-elements/RegisterFormProps';
import CustomTextField from '@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField';
import { Stack } from '@mui/system';
import useEmail from '../hooks/step2/useEmail';
import usePhone from '../hooks/step2/usePhone';
import usePass from '../hooks/step2/usePass';
import useName from '../hooks/step2/useName';
import PasswordVisibleIcon from '@/app/(DashboardLayout)/components/forms/theme-elements/PasswordVisibleIcon';


const AuthRegister2 = ({subtitle, subtext, handleNext, handleChange, handlePrev, formData }: RegisterFormProps) => {
    const [showPassword, setShowPassword] = useState(false); // 비밀번호 보여주기 
    const [showValidPassword, setValidShowPassword] = useState(false); // 비밀번호확인 보여주기 

    const {
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
    } = useEmail(handleChange,formData); // 이메일 관련 커스텀 훅 사용

    const {
        passChange,
        validPassChange,
        passErrMsg,
        validPassErrMsg,
        isPassVaild, // 비밀번호 검사 패스/논패스
    } = usePass(handleChange, formData) // 패스워드 관련 커스텀 훅

    const {
        nameChange,
        nameErrMsg,
        isNameValid, // 이름 검사 패스/논패스
    } = useName(handleChange, formData) // 이름 관련 커스텀 훅


    const {phone, handlePhoneChange} = usePhone(handleChange); // 휴대폰 관련 커스텀 훅 

     // 비밀번호 보여주기 토글
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    // 비밀번호확인 보여주기 토글
    const toggleValidPasswordVisibility = () => {
        setValidShowPassword(!showValidPassword);
    };


    return (
    <>
        {subtext}

        <Box>
            <Stack mb={3}>
                <Typography variant="subtitle1"
                    fontWeight={600} component="label" htmlFor='email' mb="5px">이메일</Typography>
                <Box display="flex" alignItems="center">
                    <CustomTextField id="email" variant="outlined" fullWidth value={formData.email} onChange={emailChange} sx={{ marginRight: 1 }} placeholder="이메일을 입력해주세요"
                   inputProps={{ readOnly: isSendEmail }}/>
                    {!isDuplicateChecked && (
                        <Button color="inherit" variant="contained" size="large" onClick={handleDuplicateCheck} sx={{ minWidth: '100px', whiteSpace: 'nowrap' }}>
                            중복확인
                        </Button>
                    )}
                    {isDuplicateChecked && (
                        <Button color="inherit" variant="contained" size="large" onClick={sendEmailCode} sx={{ minWidth: '100px', whiteSpace: 'nowrap' }} disabled={isSendEmail}>
                            인증메일 전송
                        </Button>
                    )}
                </Box>
                <Typography variant='caption' color="red">{emailErrMsg}</Typography>
                {isSendEmail && (
                    <Box display="flex" alignItems={'center'} mt={1}>
                        {!isConfirmCode && (
                            <>
                                <CustomTextField id="code" variant="outlined" placeholder="인증코드를 입력해주세요" sx={{ marginRight: 1 }} onChange={codeChange} />
                                <Button color='inherit' variant='contained' size='large' onClick={confirmCode}>
                                    인증확인
                                </Button>
                                <Typography style={{ marginLeft: '10px', width:'45px' }}>{remainingTime}</Typography> {/* 남은 시간 표시 */}
                                <Typography style={{ marginLeft: '10px', width:'120px', cursor:'pointer', textDecoration: 'underline', color: 'blue'}} onClick={sendEmailCode} variant="button">인증메일 재전송</Typography> 
                            </>
                        )}
                    </Box>
                )}

                <Typography variant="subtitle1"
                    fontWeight={600} component="label" htmlFor='password' mb="5px" mt="25px">비밀번호</Typography>
                <CustomTextField id="password" type={showPassword ? 'text' : 'password'} variant="outlined" fullWidth onChange={passChange} placeholder="비밀번호는 8자 이상 영어,숫자,특수문자를 모두 포함하셔야합니다."
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

                <Typography variant="subtitle1"
                    fontWeight={600} component="label" htmlFor='validPassword' mb="5px" mt="25px">비밀번호 확인</Typography>
                <CustomTextField id="validPassword" type={showValidPassword ? 'text' : 'password'} variant="outlined" fullWidth onChange={validPassChange} placeholder="비밀번호는 8자 이상 영어,숫자,특수문자를 모두 포함하셔야합니다."
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

                <Typography variant="subtitle1"
                    fontWeight={600} component="label" htmlFor='name' mb="5px" mt="25px">이름</Typography>
                <CustomTextField id="name" variant="outlined" fullWidth value={formData.name} onChange={nameChange}/>
                <Typography variant='caption' color="red">{nameErrMsg}</Typography>

                <Typography variant="subtitle1"
                    fontWeight={600} component="label" htmlFor='phone' mb="5px" mt="25px">전화번호</Typography>
                <CustomTextField id="phone" variant="outlined" fullWidth value={formData.phone} onChange={handlePhoneChange}/>
            </Stack>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    gap: 2, 
                }}>
                <Button color="error" variant="contained" size="large" fullWidth onClick={handlePrev}>
                    이전
                </Button>
                <Button color="primary" variant="contained" size="large" fullWidth onClick={handleNext} disabled={!(isDuplicateChecked && isConfirmCode && isPassVaild && isNameValid)}>
                    다음
                </Button>
                {/* <Button color="primary" variant="contained" size="large" fullWidth onClick={handleNext}>
                    다음
                </Button> */}
            </Box>
            
        </Box>
        {subtitle}
    </>
    );
};

export default AuthRegister2;
