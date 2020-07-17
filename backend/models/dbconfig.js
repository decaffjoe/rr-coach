const Sequelize = require('sequelize').Sequelize;

const db = new Sequelize(process.env.DB_PATH, { logging: false });

// test connection
db.authenticate()
    .then(() => console.log('db connected successfully!'))
    .catch(err => console.log(err));

module.exports = db;
