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

interface User {
    email: string;
}

async function checkUser(user: User) {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT EXISTS (SELECT 1 FROM users WHERE email = $1)', [user]);
        client.release();
        return result.rows[0]['exists'];
    }
    catch (e) {
        console.log(e);
        return null;
    }
}

async function createUser(user: User) {
    try {
        const client = await pool.connect();
        const result = await client.query('INSERT INTO users (email) VALUES ($1)', [user]);
        client.release();
        return result;
    }
    catch (e) {
        console.log(e);
        return null;
    }
}

app.get('/', (req, res) => {
    res.send('Hello from server!');
});

app.post('/api/google-login', async (req, res) => {
    const user: User = req.body.email;
    if (await checkUser(user)) {
        console.log('User exists');
        res.send('User exists');
    }
    else {
        console.log('User does not exist');
        res.send(createUser(user));    
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
