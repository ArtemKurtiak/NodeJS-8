const CustomError = require('../errors/customError');
const {
    CREATED, NOT_AUTHORIZED, NO_CONTENT, BAD_REQUEST
} = require('../constants/status-codes.enum');
const { hashPassword, comparePasswords } = require('../services/password.service');
const { generateTokens, generateActionToken } = require('../services/jwt.service');
const { User, OAuth, ActionToken } = require('../db');
const { normalizeUser } = require('../utils/user.util');
const { sendEmail, sendLogoutEmail } = require('../services/email.service');
const { forgotPass } = require('../constants/letter-types.enum');

module.exports = {

    register: async (req, res, next) => {
        try {
            const { email, password, role } = req.body;

            const hashedPassword = await hashPassword(password);

            const user = await User.create({
                email,
                password: hashedPassword,
                role
            });

            const normalizedUser = normalizeUser(user);

            const tokenPair = generateTokens();

            await OAuth.create({
                ...tokenPair,
                user: user._id
            });

            await sendEmail(email);

            res
                .status(CREATED)
                .json({ normalizedUser, ...tokenPair });
        } catch (e) {
            return next(e);
        }
    },

    login: async (req, res, next) => {
        try {
            const { user, body: { password } } = req;

            await comparePasswords(password, user.password);

            const normalizedUser = normalizeUser(user);

            const tokenPair = generateTokens();

            await OAuth.create({
                ...tokenPair,
                user: user._id
            });

            res
                .json({ normalizedUser, ...tokenPair });
        } catch (e) {
            return next(e);
        }
    },

    refreshToken: async (req, res, next) => {
        try {
            const { token } = req;

            const newTokenPair = generateTokens();

            const DbToken = await OAuth.findOneAndUpdate({ refreshToken: token }, { ...newTokenPair });

            if (!DbToken) {
                throw new CustomError('Invalid token', NOT_AUTHORIZED);
            }

            res
                .status(200)
                .json({
                    ...newTokenPair
                });
        } catch (e) {
            next(e);
        }
    },

    logout: async (req, res, next) => {
        try {
            const token = req.get('Authorization');
            const {
                currentUser: {
                    email
                }
            } = req;

            if (!token) {
                throw new CustomError('JWT Token not found', NOT_AUTHORIZED);
            }

            await OAuth.deleteOne({ accessToken: token });

            await sendLogoutEmail(email, { email });

            res
                .status(NO_CONTENT)
                .json('Success');
        } catch (e) {
            next(e);
        }
    },

    logoutEverywhere: async (req, res, next) => {
        try {
            const { currentUser } = req;
            const { email } = currentUser;

            await OAuth.deleteMany({ user: currentUser });

            await sendLogoutEmail(email, { email });

            res
                .status(NO_CONTENT)
                .json('Success');
        } catch (e) {
            next(e);
        }
    },

    forgotPassword: async (req, res, next) => {
        try {
            const { user } = req;

            const token = generateActionToken();

            await ActionToken.create({
                token,
                user
            });

            await sendEmail(user.email, forgotPass, {
                url: `http://localhost:5000/auth/reset_password?actionToken=${token}`
            });

            res.status(NO_CONTENT).json('Success');
        } catch (e) {
            next(e);
        }
    },

    resetPassword: async (req, res, next) => {
        try {
            const { oldPassword, newPassword } = req.body;
            const { user, actionToken } = req;

            await comparePasswords(oldPassword, user.password);

            const newHashedPassword = await hashPassword(newPassword);

            await User.findOneAndUpdate({ email: user.email }, {
                password: newHashedPassword
            });

            await OAuth.deleteMany({ email: user.email });

            await ActionToken.deleteOne({ token: actionToken.token });

            res
                .status(NO_CONTENT)
                .json('Success');
        } catch (e) {
            next(e);
        }
    },
};
