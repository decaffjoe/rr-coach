// IMPORTS
const express = require('express');
const app = express();

// Get req.body from requests
app.use(express.urlencoded({ extended: true }));

// DATABASE TESTING
const { resetDB, connectDB } = require('./models/seed');
connectDB().then(() => console.log('seeding done!'))
    .catch(err => console.log(err));

// RPC API ROUTES
const getRoutes = require('./routes/get'),
    postRoutes = require('./routes/post');
app.use('/get', getRoutes);
app.use('/post', postRoutes);

app.get('/', (req, res) => {
    res.json('hi');
});

// SERVER START
app.listen(3000, () => console.log('server started on http://localhost:3000/'));