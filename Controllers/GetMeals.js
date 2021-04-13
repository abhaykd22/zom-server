const MealData = require('../Models/Meals');

//@desc      Get the meal types
//@route     GET /api/zomato/getMeals
exports.getMeals = async (req, res, next) => {
	const mealtypes = await MealData.find();

	res.status(200).json({
		status: true,
		meals: mealtypes,
	});
};
