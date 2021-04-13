const restaurantDataModel = require('../Models/Restaurant');
/* 

Sample data to be given in the body

{
    "city" : "1",
    "Cuisine" : "4,3",
    "cost" : "0-500",
    "mealtype" : "1",
    "sort" : 1,
    "page" : 1
}

*/

//@desc      Get all the restaurants with applied filters
//@route     POST /api/zomato/getRestaurants
exports.filterRestaurants = async (req, res) => {
	let { city, Cuisine, cost, sort, page, mealtype } = req.body;
	const condition = {};
	let query;
	if (city && parseInt(city)) {
		condition['city'] = city;
	}
	if (Cuisine) {
		condition['Cuisine.cuisine'] = { $in: Cuisine.split(',') };
	}
	if (mealtype) {
		condition['type.mealtype'] = mealtype;
	}
	if (cost) {
		if (cost === '2000+') {
			condition['cost'] = { $gte: 2000 };
		} else {
			const boundsArray = cost.split('-').map((x) => parseInt(x));
			condition['cost'] = {
				$gte: boundsArray[0],
				$lt: boundsArray[1],
			};
		}
	}

	query = restaurantDataModel.find(condition);
	let total = await query;
	total = total.length;

	if (sort) {
		sortBy = sort === 1 ? 'cost' : '-cost';
		query = query.sort(sortBy);
	}

	if (!page) {
		page = 1;
	}

	const limit = 2;
	const startIndex = (page - 1) * limit;
	const endIndex = page * limit;
	query = query.skip(startIndex).limit(limit);

	const restaurants = await query;
	const totalPages = Math.ceil(total / limit);
	const pagination = {};

	if (endIndex < total) {
		pagination.next = {
			page: page + 1,
		};
	}
	if (startIndex > 0) {
		pagination.prev = {
			page: page - 1,
		};
	}

	res.status(200).json({
		status: true,
		totalDocs: total,
		docsInPresentPage: restaurants.length,
		totalPages,
		pagination,
		restaurants,
	});
};
