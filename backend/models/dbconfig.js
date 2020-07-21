const Sequelize = require('sequelize').Sequelize;

let db;
if (process.env.SQLITE_DB) {
    db = new Sequelize('sqlite::memory:');
} else db = new Sequelize(process.env.DB_PATH, { logging: false });

// test connection
db.authenticate()
    .then(() => console.log('db connected successfully!'))
    .catch(err => console.log(err));

module.exports = db;
