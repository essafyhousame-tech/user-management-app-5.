
const express = require('express');

const router = express.Router();

const {
    getUsers,
    getMyProfile,
    updateMyProfile,
    deleteMyProfile
} = require('../controllers/userController');

const authMiddleware = require('../middleware/authMiddleware');

router.get('/me', authMiddleware, getMyProfile);

router.put('/me', authMiddleware, updateMyProfile);

router.delete('/me', authMiddleware, deleteMyProfile);

router.get('/', authMiddleware, getUsers);

module.exports = router;
