'use client'
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import RegisterFormProps from '@/app/(DashboardLayout)/components/forms/theme-elements/RegisterFormProps';
import CustomTextField from '@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField';
import { Stack } from '@mui/system';
import useBaminID from '../hooks/step3/useBaminID';
import useBaminPW from '../hooks/step3/useBaminPW';


const AuthRegister3 = ({ subtitle, subtext, handleChange, handleNext, handlePrev, formData }: RegisterFormProps ) => {
    
    const {
        baminIDChange,
        isBaminIDValid, // 중복검사 여부 true = 통과
        baminIDErrMsg,
    } = useBaminID(handleChange, formData); // 배민아이디 관련 커스텀 훅

    const {
        baminPWErrMsg,
        validBaminPWErrMsg,
        isBaminPWValid,
        baminPWChange,
        validBaminPWChange,
    } = useBaminPW(handleChange, formData); // 배민비밀번호 관련 커스텀 훅


    return(
        <>
    
        {subtext}

        <Box>
            <Stack mb={3}>
                <Typography variant="subtitle1"
                    fontWeight={600} component="label" htmlFor='baminID' mb="5px" mt="25px">배달의민족 아이디</Typography>
                <CustomTextField id="baminID" variant="outlined" fullWidth value={formData.baminId} onChange={baminIDChange} placeholder="영문 혹은 영문+숫자, 4~20자"/>
                <Typography variant='caption' color="red">{baminIDErrMsg}</Typography>

                <Typography variant="subtitle1"
                    fontWeight={600} component="label" htmlFor='baminPW' mb="5px" mt="25px">배달의민족 비밀번호</Typography>
                <CustomTextField id="baminPW" type="password" variant="outlined" fullWidth onChange={baminPWChange} placeholder="영문+숫자 10자 이상 또는 영문+숫자+특수기호 8자 이상"/>
                <Typography variant='caption' color="red">{baminPWErrMsg}</Typography>

                <Typography variant="subtitle1"
                    fontWeight={600} component="label" htmlFor='validBaminPW' mb="5px" mt="25px">배달의민족 비밀번호 확인</Typography>
                <CustomTextField id="validBaminPW" type="password" variant="outlined" fullWidth onChange={validBaminPWChange} placeholder="영문+숫자 10자 이상 또는 영문+숫자+특수기호 8자 이상"/>
                <Typography variant='caption' color="red">{validBaminPWErrMsg}</Typography>

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
                <Button color="primary" variant="contained" size="large" fullWidth onClick={handleNext} disabled={!(isBaminIDValid && isBaminPWValid)}>
                    회원가입 완료
                </Button>
            </Box>
        </Box>
        {subtitle}
    </>
    );
};

export default AuthRegister3;


