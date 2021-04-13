const citiesData = require('../Models/City');

//@desc      Get all the cities
//@route     GET /api/zomato/getCities
exports.getCities = async (req, res) => {
	const cities = await citiesData.find();
	res.status(200).json({
		status: true,
		cities,
	});
};
