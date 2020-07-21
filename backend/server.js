require('dotenv').config();

// IMPORTS
const express = require('express');
const app = express();
const cors = require('cors');

// Get json req.body, enable CORS requests
app.use(express.json());
app.use(cors());

// DATABASE CONNECTION
const { resetDB, connectDB } = require('./models/seed');
// if (process.env.RESET_DB) {
//     resetDB().catch(err => console.log(err));
// } else connectDB().catch(err => console.log(err));
resetDB();

// RPC API ROUTES
const userRoutes = require('./routes/user'),
    workoutRoutes = require('./routes/workout'),
    exerciseRoutes = require('./routes/exercise');

app.use('/user', userRoutes);
app.use('/workout', workoutRoutes);
app.use('/exercise', exerciseRoutes);

app.get('/', (req, res) => {
    res.json('hi');
});

// SERVER START
app.listen(process.env.PORT, () => console.log(`server started at ${process.env.DOMAIN}:${process.env.PORT}/`));
