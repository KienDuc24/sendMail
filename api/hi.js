export default function handler(req, res) {
    // Kiểm tra loại yêu cầu
    if (req.method === 'GET') {
        // Trả về phản hồi JSON
        res.status(200).json({ message: 'Hello from Vercel!' });
    } else {
        // Nếu không phải yêu cầu GET, trả về lỗi
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}