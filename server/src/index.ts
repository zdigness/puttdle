import express, { Application } from 'express';

const app: Application = express();
const PORT = 3000;

app.get('/login', (req, res) => {
    res.send('Hello World');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
