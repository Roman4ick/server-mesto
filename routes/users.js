const routerusers = require('express').Router();
const { getUser, getUserId } = require('../controllers/users');

routerusers.get('/users/:Id', getUserId);
routerusers.get('/users', getUser);

module.exports = routerusers;
