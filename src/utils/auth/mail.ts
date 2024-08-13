import nodemailer from 'nodemailer';
import redis from '../../../redis/redis';
import EmailTemplate from './emailTemplate';
import ReactDOMServer from 'react-dom/server';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_SERVER,
    port: Number(process.env.SMTP_PORT),
    auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PW,
    },
});

export const sendEmail = async(to: string) => {
    const code = generateRandomCode();
    const exp = Date.now() + 3 * 60 * 1000; // 인증코드 유효시간 3분

    const mailOptions ={
        from: process.env.SMTP_FROM,
        to,
        subject: '[Review24 인증코드입니다.]',
        html: `
        <div style="font-family: 'Arial, sans-serif'; line-height: 1.5; padding: 20px;">
            <h3>안녕하세요!</h3>
            <p>귀하의 인증코드는 다음과 같습니다:</p>
            <h3 style="color: #007BFF;">${code}</h3>
            <p>
                이 코드는 <strong>3분</strong> 동안 유효합니다.<br> 만약 이 요청이 본인의 것이 아니라면 무시해 주시기 바랍니다.
            </p>
            <p>감사합니다!</p>
        </div>`,
    }

    try {
        const info = await transporter.sendMail(mailOptions);
        await redis.set(`code:${to}`, code, 'EX', exp); // 레디스에 임시저장
        return {code, exp};
    } catch (error) {
        
        throw new Error('이메일 전송 실패: 다시 시도해주세요')
    }

}

const generateRandomCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; // 대문자와 숫자
    let code = '';

    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters[randomIndex];
    }

    return code;
};


export default transporter;