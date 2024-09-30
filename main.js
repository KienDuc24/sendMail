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
        fetch('/app', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ mail, name })
        })
        .then(response => {
            if (!response.ok) throw new Error('Error sending email');
            return response.text();
        })
        .then(data => alert(data))
        .catch(error => alert('Có lỗi xảy ra: ' + error.message));
    }
});