
require('dotenv').config();

const express = require('express');
const cors = require('cors');

const sequelize = require('./config/database');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

const PORT = 3000;

sequelize.sync()
    .then(() => {
        console.log('Database connected successfully');

        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Database connection error:', error);
    });
