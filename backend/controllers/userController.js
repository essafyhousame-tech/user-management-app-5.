
const User = require('../models/User');

const getUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'name', 'email', 'createdAt']
        });

        return res.status(200).json({
            message: 'Users retrieved successfully',
            users
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
};

const getMyProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: ['id', 'name', 'email', 'createdAt']
        });

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        return res.status(200).json({
            message: 'Profile retrieved successfully',
            user
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
};

const updateMyProfile = async (req, res) => {
    try {
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({
                message: 'Name and email are required'
            });
        }

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: 'Invalid email format'
            });
        }

        const user = await User.findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        const existingUser = await User.findOne({
            where: { email }
        });

        if (existingUser && existingUser.id !== user.id) {
            return res.status(409).json({
                message: 'Email already exists'
            });
        }

        await user.update({
            name,
            email
        });

        return res.status(200).json({
            message: 'Profile updated successfully',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
};

const deleteMyProfile = async(req, res) => {
    try {
        const user = await User.findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }
        await user.destroy();

        return res.status(200).json({
            message: 'Account deleted successfully'
        });
    } catch(error) {
        return res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
};

module.exports = {
    getUsers,
    getMyProfile,
    updateMyProfile,
    deleteMyProfile
};