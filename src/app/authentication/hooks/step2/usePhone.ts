// hooks/usePhone.ts
import { useState } from 'react';

// 전화번호 형식 초기화
const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/[^\d]/g, '');
    if (numbers.length <= 3) {
        return numbers;
    } else if (numbers.length <= 7) {
        return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else {
        return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
    }
};

const usePhone = (handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void) => {
    const [phone, setPhone] = useState('');

    // 전화번호 변경감지
    const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        const formattedPhone = formatPhoneNumber(value);
        setPhone(formattedPhone);
        handleChange({ target: { id: 'phone', value: formattedPhone } });
    };

    return {
        phone,
        handlePhoneChange,
    };
};

export default usePhone;
