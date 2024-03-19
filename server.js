const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database configuration
const config = {
    user: 'your_username',
    password: 'your_password',
    server: 'your_server.database.windows.net', // Update with your server name
    database: 'your_database',
    options: {
        encrypt: true, // For Azure
        trustServerCertificate: false, // Change to true for local dev / self-signed certs
    },
};

// Routes
app.post('/login', async (req, res) => {
    try {
        await sql.connect(config);
        const { username, password } = req.body;
        const result = await sql.query`SELECT * FROM Users WHERE username = ${username} AND password = ${password}`;
        
        if (result.recordset.length > 0) {
            res.json({ message: "Login successful" });
        } else {
            res.status(400).json({ message: "Invalid credentials" });
        }
    } catch (err) {
        res.status(500).send({ message: "Server error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
