export default function handler(req, res) {
    if (req.method === 'POST') {

        window.alert("a")
        const result = "Script đã được chạy!"; // Thực hiện tác vụ ở đây

        res.status(200).json({ message: result });
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}