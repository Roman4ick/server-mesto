const routerusers = require('express').Router();
const { createUser, getUser, getUserId } = require('../controllers/users');

routerusers.get('/users/:Id', getUserId);
routerusers.get('/users', getUser);
routerusers.post('/users', createUser);
module.exports = routerusers;
