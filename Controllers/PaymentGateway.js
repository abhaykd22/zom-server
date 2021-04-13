require('dotenv').config();
const formidable = require('formidable');
const url = require('url');
const { v4: uuidv4 } = require('uuid');
const https = require('https');
const PaytmChecksum = require('./PaytmChecksum');
const TransactionSchema = require('../Models/Transaction');
exports.payment = (req, res) => {
	const { amount, email, mobileNo } = req.body;
	const totalAmount = JSON.stringify(amount);
	var params = {};
	params['MID'] = process.env.PAYTM_MID;
	params['WEBSITE'] = process.env.PAYTM_WEBSITE;
	params['CHANNEL_ID'] = process.env.PAYTM_CHANNEL_ID;
	params['INDUSTRY_TYPE_ID'] = process.env.PAYTM_INDUSTRY_TYPE_ID;
	params['ORDER_ID'] = uuidv4();
	params['CUST_ID'] = process.env.PAYTM_CUST_ID;
	params['TXN_AMOUNT'] = totalAmount;
	params['CALLBACK_URL'] = 'http://localhost:2401/api/zomato/paymentCallback';
	params['EMAIL'] = email;
	params['MOBILE_NO'] = mobileNo;

	const paytmCheckSum = PaytmChecksum.generateSignature(
		params,
		process.env.PAYTM_MERCHANT_KEY
	);

	paytmCheckSum
		.then((response) => {
			let paytmChecksumResponse = { ...params, CHECKSUMHASH: response };
			res.json({ status: true, checkSumresponse: paytmChecksumResponse });
		})
		.catch((err) => {
			console.log(err);
			res.status(404).json({ status: false, message: err });
		});
};

exports.paymentCallback = (req, res, next) => {
	const form = new formidable.IncomingForm();
	form.parse(req, (error, fields, file) => {
		if (error) {
			console.log(error);
			res.status(500).json({ status: false });
		}

		let checkSumHash = fields.CHECKSUMHASH;
		delete fields.CHECKSUMHASH;

		//verify the signature
		let verifySignature = PaytmChecksum.verifySignature(
			fields,
			process.env.PAYTM_MERCHANT_KEY,
			checkSumHash
		);
		if (verifySignature) {
			//get the transaction status
			let params = {};
			params['MID'] = fields.MID;
			params['ORDER_ID'] = fields.ORDERID;

			PaytmChecksum.generateSignature(
				params,
				process.env.PAYTM_MERCHANT_KEY
			).then((checkSum) => {
				//go to paytm server and get the status
				params['CHECKSUMHASH'] = checkSum;
				let stringifyParams = JSON.stringify(params);
				let options = {
					hostname: 'securegw-stage.paytm.in',
					port: 443,
					path: '/order/status',
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Content-Length': stringifyParams.length,
					},
				};
				let response = '';
				let request = https.request(options, (responseFromPaytm) => {
					responseFromPaytm.on('data', (chunk) => {
						response += chunk;
					});
					responseFromPaytm.on('end', () => {
						const transactionStatus = new TransactionSchema({
							transactionStatus: JSON.parse(response),
						});
						transactionStatus
							.save()
							.then((result) => {
								console.log(result);
								const statusOfTransaction =
									JSON.parse(response)['RESPCODE'] === '01'
										? '1'
										: '0';
								res.redirect(
									`http://localhost:3000/transactionStatus/?success=${statusOfTransaction}`
								);
							})
							.catch((error) => {
								next(error);
							});
					});
				});
				request.write(stringifyParams);
				request.end();
			});
		} else {
			res.status(400).json({
				status: false,
				message: "signature can't  be verified!",
			});
		}
	});
};
