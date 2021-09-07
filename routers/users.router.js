const router = require('express').Router();

const { checkAccessToken } = require('../middlewares/auth.middleware');
const {
    getAllUsers, getUserById, deleteUser, updateUser, createUser
} = require('../controllers/users.controller');
const {
    checkUserPermission,
    isFullDataInUserRequest,
    isUpdateUserDataSent, isUserIdFormatCorrect, checkUserAvailability, isUserNotExists, isUserExists
} = require('../middlewares/user.middleware');

router.use(checkAccessToken);

router.post('/', isFullDataInUserRequest, checkUserAvailability('email'), isUserNotExists, createUser);

router.get('/', getAllUsers);

router.use('/:userId', isUserIdFormatCorrect);

router.patch('/:userId',
    isUpdateUserDataSent,
    checkUserAvailability('userId', 'params', '_id'),
    isUserExists,
    checkUserAvailability('email'),
    isUserNotExists,
    checkUserPermission,
    updateUser);

router.use('/:userId', checkUserAvailability('userId', 'params', '_id'), isUserExists);

router.get('/:userId', getUserById);

router.delete('/:userId', checkUserPermission, deleteUser);

module.exports = router;
