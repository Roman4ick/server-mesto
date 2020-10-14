const routercard = require('express').Router();
const fs = require('fs').promises;
const path = require('path');

routercard.get('/cards', (req, res) => {
  fs.readFile(path.normalize('data/cards.json'), 'utf8')
    .then((data) => {
      const dataCards = JSON.parse(data);
      res.status(200).json(dataCards);
    }).catch(() => {
      res.status(404).json({ message: 'Запрашиваемый ресурс не найден' });
    });
});

module.exports = routercard;
