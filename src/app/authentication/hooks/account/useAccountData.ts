import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

const useAccountData = () => {
    const router = useRouter();
    const [userData, setUserData] = useState(null); // 사용자 정보 상태
    const [accessToken, setAccessToken] = useState(''); // 액세스토큰 상태
    const [isLoading, setIsLoading] = useState(true); // 로딩 상태

    // Step 1: 액세스토큰 가져오기
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        
        if (!token) {
            router.push('/authentication/login');
        } else {
            setAccessToken(token);
        }
    }, [router]);

    // Step 2: 유저 데이터 Fetching
    useEffect(() => {
        const fetchUserData = async () => {
            if (accessToken) {
                try {
                    const at_mno = jwtDecode(accessToken).mno;

                    const res = await fetch(`/api/auth/account/${at_mno}`, {
                        method: 'GET',
                        headers: {
                            Authorization: `${accessToken}`, 
                        },
                    });

                    const userResponse = await res.json();

                    if (!userResponse.data) {
                        alert(userResponse.message);
                    } else {
                        setUserData(userResponse.result);
                        setIsLoading(false);
                    }

                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
        };

        fetchUserData();
    }, [accessToken]);

    return { userData, isLoading };
};

export default useAccountData;
