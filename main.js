document.getElementById('mail').addEventListener('keydown', handleKeyDown);
document.getElementById('name').addEventListener('keydown', handleKeyDown);

function handleKeyDown(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Ngăn chặn hành vi mặc định
        document.getElementById('emailForm').dispatchEvent(new Event('submit'));
    }
}

document.getElementById('emailForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const mail = document.getElementById('mail').value;
    const name = document.getElementById('name').value;

    if (mail === "" || name === "") {
        window.alert("Nhập đầy đủ đi nha.");
    } else {
        document.getElementById('emailForm').addEventListener('submit', async (event) => {
            event.preventDefault(); // Ngăn chặn reload trang
    
            const response = await fetch('/api/run', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            const data = await response.json();
            alert(data.message); // Hiển thị thông báo từ server
        });
    }
});