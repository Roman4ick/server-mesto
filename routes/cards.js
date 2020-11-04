const routercard = require('express').Router();
const { getCard, deleteCard, createCard } = require('../controllers/cards');

routercard.get('/cards', getCard);
routercard.delete('/cards/:Id', deleteCard);
routercard.post('/cards', createCard);
module.exports = routercard;
