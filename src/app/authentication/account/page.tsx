'use client';
import { Grid, Box, Paper, Typography, Button } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import RootLayout from '@/app/(DashboardLayout)/layout';
import CustomTextField from '@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField';
import LoadingSpinner from '@/app/(DashboardLayout)/loading';
import useAccountData from '../hooks/account/useAccountData';
import { useState } from 'react';
import PasswordVisibleIcon from '@/app/(DashboardLayout)/components/forms/theme-elements/PasswordVisibleIcon';
import usePass from '../hooks/step2/usePass';
import RegisterFormProps from '@/app/(DashboardLayout)/components/forms/theme-elements/RegisterFormProps';
import useBaminID from '../hooks/step3/useBaminID';
import useBaminPW from '../hooks/step3/useBaminPW';


// 계정 정보 
export default function MyAccount() {

  const [showPassword, setShowPassword] = useState(false); // 비밀번호 보여주기 
  const [showValidPassword, setValidShowPassword] = useState(false); // 비밀번호확인 보여주기
  const [showBaminPassword, setShowBaminPassword] = useState(false); // 배민 비밀번호 보여주기 
  const [showBaminValidPassword, setShowBaminValidPassword] = useState(false); // 배민 비밀번호확인 보여주기 
  

  const [formData, setFormData] = useState({
    password: '',
    validPassword: '',
    baminID: '',
    baminPW: '',
    validBaminPW: '',
  });

  // 마스킹 함수
  function maskEmail(email:string) {
      const [user, domain] = email.split('@');
      const maskedUser = user[0]+user[1]+user[2] + '*'.repeat(user.length-3);
      return `${maskedUser}@${domain}`;
  }
  function maskName(name:string) {
      if (name.length <= 2) {
        return name[0] + '*';
      }
      return name[0] + '*'.repeat(name.length - 1);
  }
  function maskPhone(phone:string) {
      return phone.replace(/(\d{3})-(\d{4})-(\d{4})/, '$1-****-$3');
  }
  function maskId(id:string) {
      const length = id.length;
      const maskChar = '*'
      if (length <= 4) {
          // 아이디가 4자 이하인 경우
          const visible = id.substring(0, 2); // 앞부분 2자
          const maskedPart = maskChar.repeat(length - 2); // 나머지 부분 마스킹
          return visible + maskedPart;
      } else {
          // 아이디가 4자 이상인 경우
          const visible = id.substring(0, 4); // 앞부분 4자
          const maskedPart = maskChar.repeat(length - 4); // 나머지 부분 마스킹
          return visible + maskedPart;
      }
  }

    // 비밀번호 수정 폼 보여주기 토글
  function changePasswodForm(){
    setIsPasswordForm(!isPasswordForm);
  }

  // 비밀번호 보여주기 토글
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  // 비밀번호확인 보여주기 토글
  const toggleValidPasswordVisibility = () => {
    setValidShowPassword(!showValidPassword);
  };

  // 배민 아이디 수정 폼 보여주기 토글
  function changeBaminIDForm(){
    setisBaminIDForm(!isBaminIDForm);
  }

  // 배민 비번 수정 폼 보여주기 토글
  function changeBaminPWForm(){
    setisBaminPWForm(!isBaminPWForm);
  }

  // 배민 비밀번호 보여주기 토글
  const toggleBaminPasswordVisibility = () => {
    setShowBaminPassword(!showBaminPassword);
  };
  // 배민 비밀번호확인 보여주기 토글
  const toggleBaminValidPasswordVisibility = () => {
    setShowBaminValidPassword(!showBaminValidPassword);
  };



  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value,
    }));
  };

  const {
    passChange,
    validPassChange,
    passErrMsg,
    validPassErrMsg,
    isPassValid, // 비밀번호 검사 패스/논패스
  } = usePass(handleChange, formData) // 패스워드 검증관련 커스텀 훅

  const {
    isBaminIDValid,
    baminIDErrMsg,
    baminIDChange,
  } = useBaminID(handleChange, formData) // 배민아이디 검증관련 커스텀 훅

  const {
    baminPWChange,
    validBaminPWChange,
    baminPWErrMsg,
    validBaminPWErrMsg,
    isBaminPWValid,
  } = useBaminPW(handleChange, formData) // 배민 비밀번호 검증관련 커스텀 훅

  const { 
    userData,
    isSocial,
    isLoading,
    isPasswordForm,
    isBaminIDForm,
    isBaminPWForm,
    setisBaminPWForm,
    setisBaminIDForm,
    handleChangePassword,
    setIsPasswordForm,
    handleChangeBaminID,
    handleChangeBaminPW,
  } = useAccountData(formData); // MyAccount 커스텀 훅 호출

    return (
    <RootLayout>
      <PageContainer title="My Account" description="This is My Account">
        <Box sx={{ p: 3, height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
            {isLoading && (
                <LoadingSpinner/>
            )}
            {userData && (
            <Grid container spacing={3} sx={{ flexGrow: 1 }}>
                <Grid item xs={12} lg={8}>
                <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" gutterBottom>
                  계정정보
                  </Typography>
                  
                  <CustomTextField
                  fullWidth
                  label="이름"
                  variant="outlined"
                  margin="normal"
                  value={maskName(userData.name)}
                  inputProps={{ readOnly: true }}
                  />
                  <CustomTextField
                  fullWidth
                  label="전화번호"
                  variant="outlined"
                  margin="normal"
                  value={maskPhone(userData.phone)}
                  inputProps={{ readOnly: true }}
                  />

                  <CustomTextField
                  fullWidth
                  label="이메일"
                  variant="outlined"
                  margin="normal"
                  value={maskEmail(userData.email)}
                  inputProps={{ readOnly: true }}
                  />

                  <Box sx={{display: 'flex', gap: 2, justifyContent: 'center', alignItems: 'center'}}>
                    <CustomTextField
                    fullWidth
                    label="비밀번호"
                    variant="outlined"
                    margin="normal"
                    type="password"
                    value={"**************"}
                    inputProps={{ readOnly: true }}
                    />
                    {!isSocial && (
                      <Button variant='contained' size='medium' sx={{height:'50px', marginTop: 1}} onClick={changePasswodForm}>수정</Button>
                    )}
                  </Box>
                  
                  {isPasswordForm && (
                    <Paper elevation={3} sx={{ p: 3, mt: 2}}>
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
                        <Button variant='contained' size='medium' onClick={handleChangePassword} disabled={!isPassValid}>확인</Button>
                      </Box>
                    </Paper>
                  )}
                  
                    
                </Paper>
                </Grid>
                <Grid item xs={12} lg={4}>
                <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" gutterBottom>
                  배달의 민족 정보
                  </Typography>

                  <Box sx={{display: 'flex', gap: 3, justifyContent: 'center', alignItems: 'center'}}>
                    <CustomTextField
                    fullWidth
                    label="배민비즈 아이디"
                    variant="outlined"
                    margin="normal"
                    value={maskId(userData.baminID)}
                    inputProps={{ readOnly: true }}
                    />
                    {!isSocial && (
                      <Button variant='contained' size='medium' sx={{height:'50px', marginTop: 1}} onClick={changeBaminIDForm}>수정</Button>
                    )}
                  </Box>

                  <Box sx={{display: 'flex', gap: 3, justifyContent: 'center', alignItems: 'center'}}>
                    <CustomTextField
                    fullWidth
                    label="배민비즈 비밀번호"
                    variant="outlined"
                    margin="normal"
                    type="password"
                    value={"**************"}
                    inputProps={{ readOnly: true }}
                    />
                    {!isSocial && (
                      <Button variant='contained' size='medium' sx={{height:'50px', marginTop: 1}} onClick={changeBaminPWForm}>수정</Button>
                    )}
                  </Box>

                  {/* 배민 아이디 수정 창 */}
                  {isBaminIDForm && (
                    <Paper elevation={3} sx={{ p: 3, mt: 2}}>
                    <CustomTextField id="baminID" margin="normal" label="새 배민비즈 아이디" type='text' onChange={baminIDChange} variant="outlined" fullWidth placeholder="영문 혹은 영문+숫자, 4~20자"/>
                    <Typography variant='caption' color="red">{baminIDErrMsg}</Typography>
                    <Box sx={{textAlign: 'right', mt:1}}>
                      <Button variant='contained' size='medium' onClick={handleChangeBaminID} disabled={!isBaminIDValid}>확인</Button>
                    </Box>
                  </Paper>
                  )}
                  

                  {/* 배민 비밀번호 수정 창 */}
                  {isBaminPWForm && (
                    <Paper elevation={3} sx={{ p: 3, mt: 2}}>
                    <CustomTextField id="baminPW" margin="normal" label="새 배민비즈 비밀번호" type={showBaminPassword ? 'text' : 'password'} onChange={baminPWChange} variant="outlined" fullWidth placeholder="영문+숫자 10자 이상 또는 영문+숫자+특수기호 8자 이상"
                      InputProps={{
                        endAdornment: (
                          <PasswordVisibleIcon
                          showPassword={showBaminPassword}
                          onToggle={toggleBaminPasswordVisibility}
                          />
                        )
                      }}
                    />
                    <Typography variant='caption' color="red">{baminPWErrMsg}</Typography>

                    <CustomTextField id="validBaminPW" margin="normal" label="새 배민비즈 비밀번호 확인" type={showBaminValidPassword ? 'text' : 'password'} onChange={validBaminPWChange} variant="outlined" fullWidth placeholder="영문+숫자 10자 이상 또는 영문+숫자+특수기호 8자 이상"
                      InputProps={{
                        endAdornment: (
                          <PasswordVisibleIcon
                          showPassword={showBaminValidPassword}
                          onToggle={toggleBaminValidPasswordVisibility}
                          />
                        )
                      }}
                    />
                    <Typography variant='caption' color="red">{validBaminPWErrMsg}</Typography>

                    <Box sx={{textAlign: 'right', mt:1}}>
                        <Button variant='contained' size='medium' onClick={handleChangeBaminPW} disabled={!isBaminPWValid}>확인</Button>
                    </Box>
                  </Paper>
                  )}
                  

                </Paper>
                </Grid>
            </Grid>
          )}
        </Box>
      </PageContainer>
    </RootLayout>
  );
};

