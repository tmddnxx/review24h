'use client'
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import RootLayout from "@/app/(DashboardLayout)/layout";
import { Box, Tab, Tabs } from "@mui/material";
import { useEffect, useState } from "react";
import AuthFindIDForm from "../../auth/AuthFindIDForm";
import AuthFindPWForm from "../../auth/AuthFindPWForm";
import LoadingSpinner from "@/app/(DashboardLayout)/loading";

// 아이디 비밀번호 찾기
export default function FindIDAndPW(){
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(0); // 탭 상태
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        phone: '',
        password: '',
        validPassword: '',
    }); 

    // 페이지 로드 시 로딩 상태 처리
    useEffect(() => {
        // 시뮬레이션을 위해 타임아웃을 사용하지만, 실제로는 API 요청이나 비동기 작업을 할 수 있습니다.
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000); // 1초 후에 로딩 상태를 false로 설정

        return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 클리어
    }, []);

    // 탭 변경 핸들러
    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
        setFormData({
            email: '',
            name: '',
            phone: '',
            password: '',
            validPassword: '',
        })
    };

     // 공통 입력 핸들러
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };


    return (
        <RootLayout>
            <PageContainer>
                <Box sx={{ maxWidth: 400, margin: 'auto', mt: 4 }}>
                    {isLoading && (
                        <LoadingSpinner/>
                    )}
                    <Tabs value={activeTab} onChange={handleTabChange} centered>
                        <Tab label="아이디 찾기" />
                        <Tab label="비밀번호 찾기" />
                    </Tabs>

                    {activeTab === 0 ? (
                        <AuthFindIDForm
                            formData={formData}
                            handleChange={handleChange}
                        />
                    ) : (<></>)}

                    {activeTab === 1 ? (
                        <AuthFindPWForm
                            formData={formData}
                            handleChange={handleChange}
                        />
                    ) : (<></>)}
                    
                </Box>
            </PageContainer>
        </RootLayout>
    )
}