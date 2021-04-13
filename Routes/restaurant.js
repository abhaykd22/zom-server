const express = require('express');
const router = express.Router();
const getRestaurantByCity = require('../Controllers/GetRestaurantsByCity');
const getRestaurantById = require('../Controllers/getRestaurantsById');
const getCities = require('../Controllers/GetCities');
const getMeals = require('../Controllers/GetMeals');
const filter = require('../Controllers/Filter');
const menu = require('../Controllers/Menu');
const paymentGatewayController = require('../Controllers/PaymentGateway');

router
	.route('/restaurantByCity/:city')
	.get(getRestaurantByCity.getRestaurantByCity);
router.route('/getMeals').get(getMeals.getMeals);
router.route('/getCities').get(getCities.getCities);
router.route('/getRestaurants').post(filter.filterRestaurants);
router.route('/restaurantById/:id').get(getRestaurantById.getRestaurantById);
router.route('/getMenuItems').get(menu.getMenu);
router.route('/payment').post(paymentGatewayController.payment);
router.route('/paymentCallback').post(paymentGatewayController.paymentCallback);

module.exports = router;
