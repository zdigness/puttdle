import express, { Application } from 'express';

const app: Application = express();
const PORT = 3000;

app.use(express.json());

const { Pool } = require('pg');

const pool = new Pool ({
    user: 'postgres',
    host: 'localhost',
    database: 'puttdle',
    password: 'postgrepassword',
    port: 5432
})

const cors = require('cors');
const corsOptions = {
    origin: '*',
    credentials: true,
    optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.get('/', (req, res) => {
    res.send('Hello from server!');
});

app.post('/api/google-login', (req, res) => {
    console.log(req.body);
    res.json({ message: 'Hello from server!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
