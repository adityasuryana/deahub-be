const dotenv = require('dotenv');
dotenv.config();

const express = require('express')
const app = express()
const router = require('./router/index.js');
const cors = require('cors');
const port = process.env.PORT || 8015
const bodyParser = require('body-parser');

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
        if (!origin) return callback(null, true);

        // Allow localhost and 127.0.0.1 (any scheme or port)
        if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin) || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
            return callback(null, true);
        }

        // Allow local network IP addresses (192.168.x.x, 10.x.x.x, 172.16-31.x.x)
        if (/^https?:\/\/(192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3})(:\d+)?$/.test(origin)) {
            return callback(null, true);
        }

        // Allow deahub.dev subdomains and main domain
        if (/^https?:\/\/([a-zA-Z0-9-]+\.)*deahub\.dev(:\d+)?$/.test(origin) || origin === 'http://deahub.dev' || origin === 'https://deahub.dev') {
            return callback(null, true);
        }

        // In non-production or development mode, allow all origins
        if (process.env.NODE_ENV !== 'production') {
            return callback(null, true);
        }

        callback(new Error('Not allowed by CORS'));
    },
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', router);

// Global Error Handler Middleware
app.use((err, req, res, next) => {
    console.error('Error Handler:', err.message);
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'Ukuran file melebihi batas maksimum 5MB. Silakan kompres file Anda.' });
    }
    if (err.name === 'MulterError') {
        return res.status(400).json({ error: `Kesalahan unggah file: ${err.message}` });
    }
    if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
        const messages = err.errors.map(e => `${e.path} (${e.message})`).join(', ');
        return res.status(400).json({ error: `Kesalahan validasi data: ${messages}` });
    }
    res.status(err.status || 500).json({ error: err.message || 'Terjadi kesalahan sistem internal' });
});

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})