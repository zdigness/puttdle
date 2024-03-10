import express, { Application } from 'express';
import { get } from 'http';

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

interface Score {
    user_id: number;
    streak: number;
    total: number;
}

interface FullUser {
    user: User;
    scores: Score;
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
        const streak = 0;
        const total = 0;

        const client = await pool.connect();
        console.log("Creating user")
        await client.query('INSERT INTO users (email) VALUES ($1)', [user]);
        console.log("Selecting user")
        const newUser = await client.query('SELECT * FROM users WHERE email = $1', [user]);
        console.log("Selecting user_id")
        console.log(newUser.rows[0].id);
        console.log("Inserting scores")
        console.log(newUser.rows[0].id, streak, total);
        await client.query('INSERT INTO scores (user_id, streak, total) VALUES ($1, $2, $3)', [newUser.rows[0].id, streak, total]);
        console.log("Selecting scores")
        const scores = await client.query('SELECT * FROM scores WHERE user_id = $1', [newUser.rows[0].id]);
        client.release();

        const full: FullUser = {
            user: newUser.rows[0],
            scores: scores.rows[0]
        }
        return full;
    }
    catch (e) {
        console.log(e);
        return null;
    }
}

async function getUser(user: User) {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM users WHERE email = $1', [user]);
        const scores = await client.query('SELECT * FROM scores WHERE user_id = $1', [result.rows[0].id]);
        client.release();
        const full: FullUser = {
            user: result.rows[0],
            scores: scores.rows[0]
        }
        return full;
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
        const fullUser = await getUser(user);
        console.log(fullUser?.user.email)
        console.log(fullUser?.scores.streak);
        console.log(fullUser?.scores.total);
        res.send(fullUser);
    }
    else {
        console.log('Creating user');
        const newUser = await createUser(user);
        console.log(newUser?.user.email);
        console.log(newUser?.scores.streak);
        console.log(newUser?.scores.total);
        res.send(newUser);    
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
