const { celebrate, Joi } = require('celebrate');
const routerusers = require('express').Router();
const { getUser, getUserId } = require('../controllers/users');

routerusers.get('/users/:Id', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
}), getUserId);
routerusers.get('/users', getUser);

module.exports = routerusers;
