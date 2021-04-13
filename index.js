const express = require('express');
const mongoose = require('mongoose');
const errorHandler = require('./ErrorHandler/error');
const restaurantRoute = require('./Routes/restaurant');
const authRoute = require('./Routes/auth');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'content-type');
	next();
});

app.use('/api/zomato', restaurantRoute);
app.use('/api/auth', authRoute);
app.use(errorHandler);

app.use(express.static('client/build'));
app.get('*', (req, res) => {
	res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

mongoose
	.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/zomato', {
		useUnifiedTopology: true,
		useNewUrlParser: true,
	})
	.then((result) => {
		console.log(`mongo db connected`);
		app.listen(PORT, console.log(`Server is running at port ${PORT}`));
	})
	.catch((error) => console.log(error));
