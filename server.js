const express = require('express');
const app = express();
const mongodb = require('mongodb');
const cors = require('cors');

const db = require('./db');
const categories = require('./routes/categories');
const products = require('./routes/products');
const apiGeo = require('./routes/apiDataGeo');
const auth = require('./routes/auth');

// middlewares
app.use(express.json());

// Enabled CORS
app.use(cors());

// Routes
app.use('/categories',categories);
app.use('/products', products);
app.use('/apiDataGeo',apiGeo);
app.use('/auth',auth);

db.run();

// start server
const port = app.get('port') || 5000;
app.listen(port, () => console.log('Server is ready on ${port}'))

