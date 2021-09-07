module.exports = {
    EMAIL_REGEXP: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PASSWORD_REGEXP: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,128})/,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || 'secret1221',
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || '123secretkey',
    RESET_PASS_ACTION_TOKEN_SECRET: process.env.RESET_PASS_ACTION_TOKEN_SECRET || 'ukraine228',
    DEFAULT_EMAIL: process.env.DEFAULT_EMAIL || 'test@gmail.com',
    DEFAULT_EMAIL_PASSWORD: process.env.DEFAULT_EMAIL_PASSWORD || 'test@gmail.com',
};
