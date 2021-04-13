const menuData = require('../Models/Menu');

exports.getMenu = async (req, res, next) => {
	try {
		const menuItemsList = await menuData.find();
		res.status(200).json({
			status: true,
			items: menuItemsList,
		});
	} catch (err) {
		next(err);
	}
};
