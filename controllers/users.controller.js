const { User } = require('../db');
const { CREATED } = require('../constants/status-codes.enum');
const { normalizeUser } = require('../utils/user.util');

module.exports = {

    getAllUsers: async (req, res, next) => {
        try {
            const users = await User.find({}).select('-password -__v -role');

            res
                .json(users);
        } catch (e) {
            next(e);
        }
    },

    createUser: async (req, res, next) => {
        try {
            // if body don't have role, user schema has default value for role
            const { email, password, role } = req.body;

            await User.create({
                email,
                password,
                role
            });

            res
                .status(CREATED)
                .json({
                    message: 'Success'
                });
        } catch (e) {
            return next(e);
        }
    },

    getUserById: (req, res, next) => {
        try {
            const { user } = req;

            const normalizedUser = normalizeUser(user);

            res
                .json(normalizedUser);
        } catch (e) {
            next(e);
        }
    },

    deleteUser: async (req, res, next) => {
        try {
            const { userId } = req.params;

            await User.findByIdAndDelete(userId);

            res
                .json({ message: 'Deleted' });
        } catch (e) {
            next(e);
        }
    },

    updateUser: async (req, res, next) => {
        try {
            const { userId } = req.params;
            const { ...userData } = req.body;

            await User.findByIdAndUpdate(userId, userData);

            res
                .json({ message: 'Updated' });
        } catch (e) {
            next(e);
        }
    }
};
