"use client";

import { LinearProgress, Grid, Box, Card, Typography, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import Logo from "@/app/(DashboardLayout)/layout/shared/logo/Logo";
import AuthRegister1 from "../auth/AuthRegister1";
import AuthRegister2 from "../auth/AuthRegister2";
import AuthRegister3 from "../auth/AuthRegister3";
import { useRouter, useSearchParams } from "next/navigation";


export default function Register() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    termsAccepted: {
      term1: false,
      term2: false,
      term3: false,
    },
    email: '',
    code: '',
    password: '',
    validPassword: '',
    name: '',
    phone: '',
    baminID: '',
    baminPW: '',
    validBaminPw: '',
    social: 'credentials',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value,
    }));
  };


  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      termsAccepted: {
        ...prevFormData.termsAccepted,
        [name]: checked,
      },
    }));
  };

  const handleNext = async () => {
    switch(step) {
      case 1:
        // Step 1 사용자 약관 체크 검증
        if(!Object.values(formData.termsAccepted).every(value => value)){
          alert('모든 약관에 동의해야합니다.');
          return;
        }
        // 서버검증
        const termsRes = await fetch('/api/auth/signUp/valid/step1', {
          method: 'POST',
          body: JSON.stringify(formData.termsAccepted),
        })
        const termsValid = await termsRes.json();
        console.log(termsValid.success);
        if(!termsValid.success){
          alert(termsValid.message);
          return;
        }
        setStep(2);
        break;
      
      case 2:
        // Step 2 회원정보에 대한 검증
        const userRes = await fetch('/api/auth/signUp/valid/step2', {
          method: 'POST',
          body: JSON.stringify(formData),
        });
        const userValid = await userRes.json();
        
        if(!userValid.success){
          alert(userValid.message);
          return;
        }
        setStep(3);
        break;

      case 3:
        // Step 3 배민정보에 대한 검증
        const baminRes = await fetch('/api/auth/signUp/valid/step3', {
          method: 'POST',
          body: JSON.stringify(formData),
        });
        const baminValid = await baminRes.json();
        if(!baminValid.success){
          alert(baminValid.message);
          return;
        }

        // 회원가입 처리
        const signUpRes = await fetch('/api/auth/signUp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        const signUpData = await signUpRes.json();
        if(!signUpRes.ok){
          alert('오류가 발생했습니다. 다시 시도해주세요');
        }else{ // 회원가입 성공 시 로그인페이지로 Redirect
          router.push('/authentication/login'); 
        }
        break;
    }
    
  };

  const handlePrev = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const getProgress = (step: any) => {
    switch(step) {
      case 1:
        return 0;
      case 2:
        return 50;
      case 3:
        return 100;
      default:
        return 0;
    }
  };

  const searchParam = useSearchParams();
  const [isFetched, setIsFetched] = useState(false); // 한 번만 실행하기 위한 상태
  useEffect(() => {
    const social = searchParam.has('provider')

    if(social && !isFetched){
      checkOAuth()
    }
  }, [isFetched]);

  async function checkOAuth() {
    
    try {
      const response = await fetch('/api/auth/oAuthSignUp');
      const data = await response.json();
  
      if (data === null) {
        alert('다시 시도해주세요');
        return '/authentication/login';
      } else {
         
        setStep(3); // object가 존재하면 step을 3으로 설정
        setIsFetched(true)
      }
    } catch (error) {
      console.error("Error fetching OAuth data:", error);
    }
  }

  

  return ( 
    <PageContainer title="Register" description="this is Register page">
      
      <Box
        sx={{
          position: "relative",
          minHeight: "100vh",
          width: "100%",
          overflowY: "auto",
          overflowX: "hidden",
          display: "flex",
          alignItems: "center", 
          justifyContent: "center", 
          
          "&:before": {
            content: '""',
            background: "radial-gradient(#d2f1df, #d3d7fa, #bad8f4)",
            backgroundSize: "400% 400%",
            animation: "gradient 15s ease infinite",
            position: "absolute",
            height: "100%",
            width: "100%",
            opacity: "0.3",
          },
        }}
      >
        
        <Grid
          container
          spacing={0}
          justifyContent="center"
          alignItems="center"
          sx={{ height: "100%" }}
        >
          
          <Grid
            item
            xs={6}
            sm={6}
            lg={6}
            xl={6}
            display="flex"
             flexDirection="column"
            justifyContent="center"
            alignItems="center"
            mt={3}
            mb={3}
          >
            <Box display="flex" alignItems="center" justifyContent="center">
                <Logo />
            </Box>

            <Card
              elevation={9}
              sx={{ p: 4, zIndex: 1, width: "700px", maxWidth: "700px" }}
            > 
              <Box>
                <Typography fontWeight="700" variant="h2" mb={1} textAlign="center">
                    회원가입
                </Typography>
                <Box
                sx={{
                  width: "100%",
                  mb: 2
                }}
              >
                  <LinearProgress variant="determinate" value={getProgress(step)} />
                  <Stack direction="row" spacing={2} justifyContent="space-between" mt={1}>
                    <Typography variant="caption" color={step === 1 ? 'primary.main' : 'textSecondary'}>약관 동의</Typography>
                    <Typography variant="caption" color={step === 2 ? 'primary.main' : 'textSecondary'}>사용자 정보입력</Typography>
                    <Typography variant="caption" color={step === 3 ? 'primary.main' : 'textSecondary'}>배달의민족 정보입력</Typography>
                  </Stack>
                </Box>
                <Stack spacing={3}>
                  {step === 1 && (
                    <AuthRegister1 
                      
                      formData={formData}
                      handleChange={handleChange}
                      handleCheckboxChange={handleCheckboxChange}
                      handleNext={handleNext}
                      />
                  )}
                   {step === 2 && (
                    <AuthRegister2 
                      
                      formData={formData}
                      handleChange={handleChange}
                      handleNext={handleNext}
                      handlePrev={handlePrev}
                      />
                  )}
                   {step === 3 && (
                    <AuthRegister3 
                      
                      formData={formData} 
                      handleChange={handleChange}
                      handleNext={handleNext}
                      handlePrev={handlePrev}
                      />
                  )}
                </Stack>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
}
