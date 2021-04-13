const RestaurantData = require('../Models/Restaurant');

//@desc      Get the restaurant by it's id
//@route     GET /api/zomato/restaurantById/:id
exports.getRestaurantById = async (req, res, next) => {
	try {
		const { id } = req.params;

		const restaurant = await RestaurantData.findOne({
			_id: id,
		});

		res.status(200).json({
			status: true,
			restaurant,
		});
	} catch (error) {
		next(error);
	}
};
