const Sequelize = require('sequelize')

const sequelize = new Sequelize('webville', 'root', 'Shashank@143',{
    dialect: 'mysql',
    host:'localhost'
});

module.exports = sequelize;