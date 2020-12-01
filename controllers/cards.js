const Card = require('../models/card');

module.exports.getCard = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};
module.exports.deleteCard = (req, res) => {
  const cardId = req.params._id;
  Card.findOne(cardId)
    .orFail(new Error('NotValidId'))
    .then((card) => {
      if (card.owner._id.toString() !== req.user._id) {
        res.status(403).send({ message: 'Недостаточно прав!' });
      } else {
        Card.findOneAndRemove(cardId)
          .then((cards) => {
            res.send({ data: cards });
          });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else if (err.message === 'NotValidId') {
        res.status(404).send({ message: 'Такой карточки нет в базе' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};
