const { Laptop } = require('../db');
const { CREATED } = require('../constants/status-codes.enum');

module.exports = {
    getAllLaptops: async (req, res, next) => {
        try {
            const laptops = await Laptop.find({}).select('-__v');

            res
                .json(laptops);
        } catch (e) {
            next(e);
        }
    },

    createLaptop: async (req, res, next) => {
        try {
            await Laptop.create({
                ...req.body
            });

            res
                .status(CREATED)
                .json({ message: 'Created' });
        } catch (e) {
            next(e);
        }
    },

    updateLaptop: async (req, res, next) => {
        try {
            const { laptopId } = req.params;

            await Laptop.findByIdAndUpdate(laptopId, { ...req.body });

            res
                .json({ message: 'Updated' });
        } catch (e) {
            next(e);
        }
    },

    deleteLaptop: async (req, res, next) => {
        try {
            const { laptopId } = req.params;

            await Laptop.findByIdAndDelete(laptopId);

            res
                .json({ message: 'Deleted' });
        } catch (e) {
            next(e);
        }
    },

    getLaptopById: async (req, res, next) => {
        try {
            const { laptopId } = req.params;

            const laptop = await Laptop.findById(laptopId).select('-__v');

            res
                .json(laptop);
        } catch (e) {
            next(e);
        }
    }
};
