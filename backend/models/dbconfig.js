const Sequelize = require('sequelize').Sequelize;

// const db = new Sequelize('postgres://postgres:test@localhost:5432/recommended-routine', { logging: false });
const db = new Sequelize('sqlite::memory:', { logging: false });

// test connection
db.authenticate()
    .then(() => console.log('db connected successfully!'))
    .catch(err => console.log(err));

module.exports = db;
