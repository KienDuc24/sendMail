const { exec } = require('child_process');

exec('node run.js', (error, stdout, stderr) => {
    if (error) {
        console.error(`Lỗi: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`Lỗi: ${stderr}`);
        return;
    }
    console.log(`Kết quả: ${stdout}`);
});