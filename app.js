const express = require('express');
const mongoose = require('mongoose');

require('dotenv').config();

const { usersRouter, authRouter, laptopRouter } = require('./routers');

mongoose.connect(process.env.MONGODB_URI);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRouter);

app.use('/users', usersRouter);

app.use('/laptops', laptopRouter);

app.use(_errorHandler);

// eslint-disable-next-line
function _errorHandler(err, req, res, next) {
    const { message = 'Something wrong', status = 500 } = err;

    return res
        .status(status)
        .json({
            message
        });
}

app.listen(process.env.PORT, () => {
    console.log(`Server run at port ${process.env.PORT}`);
});
