const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TransactionSchema = new Schema({
	transactionStatus: {
		type: Object,
	},
});

module.exports = mongoose.model(
	'transaction',
	TransactionSchema,
	'transaction'
);
