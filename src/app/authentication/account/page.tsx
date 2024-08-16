'use client';
import { Grid, Box, Paper, Typography, Button } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import RootLayout from '@/app/(DashboardLayout)/layout';
import CustomTextField from '@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField';
import LoadingSpinner from '@/app/(DashboardLayout)/loading';
import useAccountData from '../hooks/account/useAccountData';


// 계정 정보 
export default function MyAccount() {
    const { userData, isLoading } = useAccountData(); // 커스텀 훅 호출

    // 마스킹 함수
    function maskEmail(email:string) {
        const [user, domain] = email.split('@');
        const maskedUser = user[0] + '*'.repeat(user.length-1);
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
                    label="이메일"
                    variant="outlined"
                    margin="normal"
                    value={maskEmail(userData.email)}
                    inputProps={{ readOnly: true }}
                    />
                    <CustomTextField
                    fullWidth
                    label="비밀번호"
                    variant="outlined"
                    margin="normal"
                    type="password"
                    value={"**************"}
                    inputProps={{ readOnly: true }}
                    />
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
                    <Button variant='contained'>비밀번호 재설정</Button>
                </Paper>
                </Grid>
                <Grid item xs={12} lg={4}>
                <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                    <Typography variant="h6" gutterBottom>
                    배달의 민족 정보
                    </Typography>
                    <CustomTextField
                    fullWidth
                    label="배민비즈 아이디"
                    variant="outlined"
                    margin="normal"
                    value={maskId(userData.baminID)}
                    inputProps={{ readOnly: true }}
                    />
                    <CustomTextField
                    fullWidth
                    label="배민비즈 비밀번호"
                    variant="outlined"
                    margin="normal"
                    type="password"
                    value={"**************"}
                    inputProps={{ readOnly: true }}
                    />
                </Paper>
                </Grid>
            </Grid>
          )}
          <Box sx={{ mt: 3, textAlign: 'right' }}>
            <Button variant="contained" color="primary">
              Save Changes
            </Button>
          </Box>
        </Box>
      </PageContainer>
    </RootLayout>
  );
};

