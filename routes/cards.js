const { celebrate, Joi } = require('celebrate');
const routercard = require('express').Router();
const { getCard, deleteCard, createCard } = require('../controllers/cards');

routercard.get('/cards', getCard);
routercard.delete('/cards/:Id', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
}), deleteCard);
routercard.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(/^((http|https|ftp):\/\/)?(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)/i),
  }),
}), createCard);
module.exports = routercard;
