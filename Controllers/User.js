const User = require('../Models/User');
const bcrypt = require('bcryptjs');
const ErrorResponse = require('../ErrorHandler/ErrorResponse');

exports.signUp = (req, res, next) => {
	const { email, firstName, lastName, password } = req.body;

	const signupUser = new User({
		email: email,
		firstName: firstName,
		lastName: lastName,
		password: password,
	});

	signupUser
		.save()
		.then((result) => {
			res.status(200).json({
				status: true,
				message: 'User signed successfully',
			});
		})
		.catch((error) => {
			next(error);
		});
};

exports.login = async (req, res, next) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return next(
			new ErrorResponse('Please provide an email and password', 400)
		);
	}

	const user = await User.findOne({ email });

	if (!user) {
		return next(new ErrorResponse('Invalid Credentials', 401));
	}

	const isMatch = await user.matchPassword(password);

	if (!isMatch) {
		return next(new ErrorResponse('Invalid Credentials', 401));
	} else {
		res.status(200).json({
			status: true,
			message: 'Signed in Successfully',
			name: user.firstName,
		});
	}
};
