import React, {useEffect, useState} from "react";
import { signIn } from 'next-auth/react';
import { useSearchParams } from "next/navigation";
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Button,
  Stack,
  Checkbox,
  Snackbar,
  Alert,
} from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import CustomTextField from "@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField";
import useIntegrateSocial from "../hooks/account/useIntegrateSocial";
import CustomPasswordField from "@/app/(DashboardLayout)/components/forms/theme-elements/PasswordVisibleIcon";
import PasswordVisibleIcon from "@/app/(DashboardLayout)/components/forms/theme-elements/PasswordVisibleIcon";


interface loginType {
  title?: string;
  subtitle?: JSX.Element | JSX.Element[];
  subtext?: JSX.Element | JSX.Element[];
}

const AuthLogin = ({ title, subtitle, subtext }: loginType) => {
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const searchParams = useSearchParams();
  const [showAlert, setShowAlert] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false); // 비밀번호 보여주기 

  const {updateSocialID} = useIntegrateSocial();

  useEffect(() => {
    if(!showAlert){

      // 미들웨어 설정
      if (searchParams.get('isLogin') === 'false'){
        setMessage('로그인이 필요한 페이지입니다.');
        setShowAlert(true);
      }

      // 소셜회원 확인
      if (searchParams.has('provider', 'naver')) {
        setMessage('네이버로 등록된 회원입니다.');
        setShowAlert(true);
      } else if (searchParams.has('provider', 'kakao')) {
        setMessage('카카오로 등록된 회원입니다.');
        setShowAlert(true);
      }

      //  일반회원의 소셜연동 
      if (searchParams.has('social')) { 
        const integrateMsg = confirm('일반 회원가입된 유저입니다. 소셜계정을 연동하시겠습니까?');
        const socialId = searchParams.get("social_id");
        const mno = searchParams.get("mno");
        const social = searchParams.get('social');

        if (integrateMsg) {
          console.log("연동실행");
          updateSocialID(social, socialId, mno);
        } else {
          return;
        }
      }

      // 로그인 실패
      if(searchParams.has('error')){
        alert('일치하는 정보가 없습니다.');
      }

    }
  }, [searchParams]);

  // 알럿창 끄기
  const handleClose = () => {
    setShowAlert(false);
  };

  // 로그인 메서드
  const handleLogin = async () => {
      await signIn("credentials", {
        email: email,
        password: password,
      });
  };

  // 엔터키
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };
  
  // 비밀번호 보여주기 토글
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  return(
  <>
    {title ? (
      <Typography fontWeight="700" variant="h2" mb={1}>
        {title}
      </Typography>
    ) : null}

    {subtext}

    <Stack>
      {showAlert && searchParams.has('isLogin') && (
        <Alert 
            severity="info" 
            onClose={handleClose} 
            sx={{
              width: '80%',
              maxWidth: '600px',
              height: '70px',
              fontSize: 'large',
              fontWeight: 'bold',
              textAlign: 'center',
              lineHeight: '70px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#ebebeb',
              position: 'fixed',
              top: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1000,
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            }}
        >
            {message}
        </Alert>
      )}
      <Box>
        <Typography
          variant="subtitle1"
          fontWeight={600}
          component="label"
          htmlFor="email"
          mb="5px"
        >
          Email
        </Typography>
        <CustomTextField id="email" variant="outlined" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={handleKeyPress}/>
      </Box>
      <Box mt="25px">
        <Typography
          variant="subtitle1"
          fontWeight={600}
          component="label"
          htmlFor="password"
          mb="5px"
        >
          Password
        </Typography>
        <CustomTextField id="password" type={showPassword ? 'text' : 'password'} variant="outlined" fullWidth value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={handleKeyPress}
          InputProps={{
            endAdornment: (
              <PasswordVisibleIcon
              showPassword={showPassword}
              onToggle={togglePasswordVisibility}
              />
            )
          }}/>
      </Box>
      <Stack
        justifyContent="space-between"
        direction="row"
        alignItems="center"
        my={2}
      >
        <Typography
          component={Link}
          href="/"
          fontWeight="500"
          sx={{
            textDecoration: "none",
            color: "primary.main",
          }}
        >
          아이디/비밀번호 찾기
        </Typography>
      </Stack>
    </Stack>
    <Box>
      <Button
        color="primary"
        variant="contained"
        size="large"
        fullWidth
        onClick={handleLogin}
        type="submit"
      >
        로그인
      </Button>
    </Box>
    <Box position="relative" mt={3} pt={3} borderTop="1px solid #b4b4b4">
            {showAlert && searchParams.has('provider') && (
                <Alert 
                    severity="info" 
                    onClose={handleClose} 
                    sx={{
                      width: '320px',
                      backgroundColor: '#ebebeb',
                      fontSize: 'medium',
                      fontWeight: 'bold',
                      position: 'absolute', 
                      top: -40, // 이미지 위에 위치하도록 조정
                      left: '50%',
                      transform: 'translateX(-50%)',
                      zIndex: 1,
                    }}
                >
                    {message}
                </Alert>
            )}
            <Box display="flex" justifyContent="space-evenly">
                <Image 
                    src="/images/socials/kakao_login_medium_narrow.png" 
                    alt="KakaoLoginBtn" 
                    width={200} 
                    height={40} 
                    onClick={() => signIn('kakao')} 
                    style={{ cursor: 'pointer' }} 
                />
                <Image 
                    src="/images/socials/naver_login_btn.png" 
                    alt="NaverLoginBtn" 
                    width={200} 
                    height={40} 
                    onClick={() => signIn('naver')} 
                    style={{ cursor: 'pointer' }} 
                />
            </Box>
        </Box>
    {subtitle}
  </>
  );
};

export default AuthLogin;
