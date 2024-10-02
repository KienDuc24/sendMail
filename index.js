const nodemailer = require('nodemailer');
const { google } = require('googleapis');
require('dotenv').config();

// const CLIENT_ID = process.env.CLIENT_ID;
// const CLIENT_SECRET = process.env.CLIENT_SECRET;
// const REDIRECT_URI = process.env.REDIRECT_URI;
// const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

let isMailSent = false; // Cờ để kiểm tra trạng thái

async function sendMail() {
    if (isMailSent) {
        console.log("Hàm sendMail đã được gọi một lần và sẽ không được gọi lại.");
        return; // Ngừng thực hiện nếu đã gửi email
    }

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
            to: 'buiduckien24@gmail.com',
            subject: "Test",
            text: "cl",
            html: '',
        };

        const result = await transport.sendMail(mailOptions);
        console.log("Email sent:", result);
        isMailSent = true; // Đánh dấu rằng email đã được gửi
        return result;
    } catch (error) {
        console.error("Error sending email:", error.message);
        throw error; // Ném lại lỗi để có thể xử lý ở nơi khác nếu cần
    }
}

// Gọi hàm sendMail một lần
sendMail().catch((error) => console.log("Error:", error.message));