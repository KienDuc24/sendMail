import data from './run.json';

export default function handler(req, res) {
    res.status(200).json(data);
}