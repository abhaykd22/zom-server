const RestaurantData = require('../Models/Restaurant');

//@desc      Get the restaurants list in a city
//@route     GET /api/zomato/restaurantByCity/:city
exports.getRestaurantByCity = async (req, res, next) => {
	try {
		const { city } = req.params;

		const restaurantsList = await RestaurantData.find({
			city: city,
		});

		res.status(200).json({
			status: true,
			NoOfDocs: restaurantsList.length,
			restaurants: restaurantsList,
		});
	} catch (error) {
		next(error);
	}
};
