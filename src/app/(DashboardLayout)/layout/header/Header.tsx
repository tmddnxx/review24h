import React, { useEffect, useState } from 'react';
import { Box, AppBar, Toolbar, styled, Stack, IconButton, Badge, Button } from '@mui/material';
import PropTypes from 'prop-types';
import Link from 'next/link';
// components
import Profile from './Profile';
import { IconBellRinging, IconMenu } from '@tabler/icons-react';
import { signOut, useSession } from 'next-auth/react';
import { jwtDecode } from 'jwt-decode';
import Logo from '../shared/logo/Logo';

interface ItemType {
  toggleMobileSidebar:  (event: React.MouseEvent<HTMLElement>) => void;
}

const Header = ({toggleMobileSidebar}: ItemType) => { 

  // const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  // const lgDown = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  // 액세스토큰 로컬 스토리지 저장 및 자동갱신 
  const session = useSession();
  const [isLogin, setIsLogin] = useState(false); // 로그인 상태확인

  useEffect(() => {
    if (session.status === 'authenticated') {
      setIsLogin(true);

      const checkTokenExpiry = async () => {
        const accessToken = session.data.user.accessToken;

        if (accessToken) {
          localStorage.setItem('accessToken', accessToken);
        }

        let LSAT = localStorage.getItem('accessToken');
        if (LSAT) {
          const decoded = jwtDecode(LSAT);
          const at_ex = decoded.exp;
          const currentTime = Math.floor(Date.now() / 1000);

          if ((at_ex - currentTime) <=  5 * 60) {
            try {
              const response = await fetch('/api/auth/token', {
                method: 'POST',
                headers: { Authorization: LSAT },
              });

              if (!response.ok) {
                const errorData = await response.json();
                alert(errorData.message);

                handleLogout();
                return;
              }

              const data = await response.json();

              if (data.accessToken) {
                localStorage.setItem('accessToken', data.accessToken);
                console.log('새 액세스 토큰:', data.accessToken);

                LSAT = data.accessToken;
                session.update({ accessToken: data.accessToken });
              } else {
                console.log("새로운 토큰을 발급 받을 수 없습니다.");
              }
            } catch (error) {
              console.error('토큰 갱신 오류:', error);
              handleLogout();
            }
          }
        }
      };

      checkTokenExpiry();
    }
  }, [session]); // session이 변경될 때만 실행

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    
    fetch('/api/auth/logout',{
        method:'POST',
    })
    signOut();
    setIsLogin(false); 
  };

  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    boxShadow: 'none',
    background: theme.palette.background.paper,
    justifyContent: 'center',
    backdropFilter: 'blur(4px)',
    [theme.breakpoints.up('lg')]: {
      minHeight: '70px',
    },
  }));
  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    width: '100%',
    color: theme.palette.text.secondary,
  }));

  return (
    <AppBarStyled position="sticky" color="default">
      <ToolbarStyled>

        <IconButton
          color="inherit"
          aria-label="menu"
          onClick={toggleMobileSidebar}
          sx={{
            display: {
              lg: "none",
              xs: "inline",
            },
          }}
        >
          <IconMenu width="20" height="20" />
        </IconButton>

        <Logo/>
        
        <IconButton
          size="large"
          aria-label="show 11 new notifications"
          color="inherit"
          aria-controls="msgs-menu"
          aria-haspopup="true"
        >
          <Badge variant="dot" color="primary">
            <IconBellRinging size="21" stroke="1.5" />
          </Badge>
        </IconButton>

        <Box flexGrow={1} />
        <Stack spacing={1} direction="row" alignItems="center">
          {!isLogin && (
            <Button variant="contained" component={Link} href="/authentication/login"   disableElevation color="primary" >
              Login
            </Button> 
          )}
          {isLogin && (
            <Button variant="contained" onClick={handleLogout} disableElevation color="primary" >
              LogOut
            </Button>
          )}
          <Profile />
        </Stack>
      </ToolbarStyled>
    </AppBarStyled>
  );
};

Header.propTypes = {
  sx: PropTypes.object,
};

export default Header;
