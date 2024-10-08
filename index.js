const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const axios = require('axios');
require('dotenv').config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const API_KEY = 'AIzaSyBd60-OctHoc172QP1LGU4wShT30Bjm8k4';
const SCRIPT_ID = 'https://script.google.com/macros/s/AKfycbwGtiVpeQLmm53FmRgjnUk6jV0xRxTQZz3clfJu7Hd2Ncb5ltS39QgYJ0vOT4MbSma3/exec';

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function fetchData() {
    const response = await axios.get(`${SCRIPT_ID}?key=${API_KEY}`);
    return response.data;
}

async function sendMail(name, email) {
    try {
        const accessToken = await oAuth2Client.getAccessToken();

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'kienducbui24@gmail.com',
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken,
            },
        });

        const mailOptions = {
            from: 'Bùi Đức Kiên <kienducbui24@gmail.com>',
            to: email,
            subject: "Xác nhận",
            html: `
    <pXin chào ${name},</p>
    <p>Tôi đã nhận được lời xác nhận tham gia buổi đi chơi Halloween vào ngày 27/10/2024 của bạn.</p>
    <p>Nếu có bất kì sự thay đổi hay góp ý gì, vui lòng liên hệ lại với tôi qua:</p>
        <ul>
            <li>Facebook: <a href="https://www.facebook.com/daylakienduc/">Kiên Đức</a></li>
            <li>Instagram: <a href="https://www.instagram.com/its.kien/">its.kien</a></li>
            <li>TikTok: <a href="hhttps://www.tiktok.com/@kienduk">kienduk</a> (nếu có chuỗi, hãy nhớ duy trì)</li>
            <li>SĐT: 0989050084</li>
            <li>Địa chỉ nhà: P1402, Chung cư HandHud, ngõ 234 Hoàng QUốc Việt, Bắc Từ Liêm, Hà Nội (yêu cầu không qua đốt)</li>
        </ul>
`
        };

        const result = await transport.sendMail(mailOptions);
        console.log("Email đã được gửi:", result);
        return result;
    } catch (error) {
        console.error("Lỗi khi gửi email:", error.message);
        throw error;
    }
}

async function redeploy() {
    const vercelToken = process.env.VERCEL_API_TOKEN;
    const projectId = process.env.VERCEL_PROJECT_ID;

    try {
        const response = await axios.post(`https://api.vercel.com/v1/deployments`, {
            name: 'Send Mail', // Tên dự án của bạn
        }, {
            headers: {
                Authorization: `Bearer ${vercelToken}`,
                'Content-Type': 'application/json',
            },
        });

        console.log('Đã yêu cầu tái triển khai:', response.data);
    } catch (error) {
        console.error('Lỗi khi tái triển khai:', error.message);
    }
}

async function main() {
    try {
        const data = await fetchData(); // Lấy tất cả các hàng

        if (!Array.isArray(data) || data.length === 0) {
            console.log("Không có dữ liệu để xử lý.");
            return;
        }

        // Gửi mail cho những người có status = 0
        for (let i = 0; i < data.length; i++) {
            const { name, email, stt } = data[i]; // Lấy giá trị từ mảng

            if (data[i].stt === 0) {  // Kiểm tra trạng thái
                await sendMail(name, email);  // Gửi email

                // Cập nhật trạng thái
                const updateResponse = await fetch(`https://script.google.com/macros/s/AKfycbwSZBU9PQomOMKXO5vibtIJejBjXQWfn9zR8HSywjmMlDiwJZUrLqxO2WMEMnWa-HVl/exec?rowIndex=${i + 2}`);
                const updateData = await updateResponse.text();
                console.log(updateData);
            }
        }

        console.log("Gửi email và cập nhật trạng thái thành công.");

    } catch (error) {
        console.error("Lỗi:", error.message);
    }
}

// Gọi hàm main lần đầu tiên
main();

// Khởi động lại server mỗi 5 phút
setInterval(async () => {
    await redeploy();
}, 60 * 1000); // 5 phút