const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (
            typeof name !== 'string' ||
            typeof email !== 'string' ||
            typeof password !== 'string' ||
            !name.trim() ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                message: 'All fields are required'
            });
        }

        const cleanName = name.trim();
        const cleanEmail = email.trim().toLowerCase();

        if (cleanName.length < 2 || cleanName.length > 50) {
            return res.status(400).json({
                message: 'Name must be between 2 and 50 characters'
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(cleanEmail)) {
            return res.status(400).json({
                message: 'Invalid email format'
            });
        }
        if (password.length < 8) {
            return res.status(400).json({
                message: 'Password must be at least 8 characters'
            });
        }
        const existingUser = await User.findOne({
            where: { email: cleanEmail }
        });

        if (existingUser) {
            return res.status(409).json({
                message: 'Email already exists'
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name: cleanName,
            email: cleanEmail,
            password: hashedPassword
        });

        return res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email
            }
        });

    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({
                message: 'Email already exists'
            });
        }

        console.error('Register error:', error);

        return res.status(500).json({
            message: 'Server error'
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (
            typeof email !== 'string' ||
            typeof password !== 'string' ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                message: 'Email and password are required'
            });
        }

        const cleanEmail = email.trim().toLowerCase();

        const user = await User.findOne({
            where: { email: cleanEmail }
        });

        if (!user) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }
        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is missing');

            return res.status(500).json({
                message: 'Server configuration error'
            });
        }
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1d'
            }
        );

        return res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Login error:', error);

        return res.status(500).json({
            message: 'Server error'
        });
    }
};


module.exports = {
    register,
    login
};
