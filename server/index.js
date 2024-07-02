require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:5000'], credentials: true }));

// Configurar la conexión a la base de datos
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Conectar a la base de datos
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the remote database.');
});

// Middleware para verificar el token JWT
const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'No token provided' });

    jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
        if (err) return res.status(500).json({ message: 'Failed to authenticate token' });
        req.userId = decoded.id;
        req.username = decoded.username;
        next();
    });
};

// Ruta de registro de usuario
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.length > 0) return res.status(409).send('Username already exists');

        const hashedPassword = await bcrypt.hash(password, 10);
        db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err, results) => {
            if (err) return res.status(500).send(err);

            const userId = results.insertId;
            const token = jwt.sign({ id: userId, username: username }, 'your_jwt_secret', { expiresIn: '1h' });
            res.cookie('token', token, { httpOnly: true });
            res.status(201).json({ message: 'User registered and logged in successfully', token, username });
        });
    });
});

// Ruta de inicio de sesión
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.length === 0) return res.status(404).send('User not found');

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).send('Invalid credentials');

        const token = jwt.sign({ id: user.id, username: user.username }, 'your_jwt_secret', { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true });
        res.json({ message: 'Logged in successfully', token, username: user.username });
    });
});

// Ruta de bienvenida
app.get('/api/welcome', verifyToken, (req, res) => {
    res.json(`Welcome, ${req.username}!`);
});

// Ruta de productos
app.get('/api/products', (req, res) => {
    db.query('SELECT * FROM products', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// Ruta de cierre de sesión
app.post('/api/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
});


// Ruta para obtener los detalles de un evento específico
app.get('/api/events/:id', (req, res) => {
    const eventId = req.params.id;
    db.query('SELECT * FROM products WHERE id = ?', [eventId], (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.length === 0) return res.status(404).send('Event not found');
        res.json(results[0]);
    });
});

// Servir archivos estáticos de React
app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

// Manejar todas las rutas con React Router
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});

// Iniciar el servidor
app.listen(5000, () => {
    console.log('Server started on port 5000');
});
