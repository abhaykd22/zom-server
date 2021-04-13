const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
	email: {
		type: String,
		required: [true, 'Please add an email'],
		unique: true,
	},
	firstName: {
		type: String,
		required: [true, 'Please add your firstname'],
	},
	lastName: {
		type: String,
		required: [true, 'Please add your lastname'],
	},
	password: {
		type: String,
		required: [true, 'Please add a password'],
	},
});

UserSchema.pre('save', async function (next) {
	const salt = await bcrypt.genSalt(12);
	this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.matchPassword = async function (enteredPass) {
	return await bcrypt.compare(enteredPass, this.password);
};

module.exports = mongoose.model('User', UserSchema);
