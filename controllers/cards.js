const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');

module.exports.getCard = (req, res, next) => {
  Card.find({})
    .populate('owner')
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};
module.exports.deleteCard = (req, res, next) => {
  const cardId = req.params._id;
  Card.findOne(cardId)
    .orFail(new NotFoundError('Такой карточки нет в базе'))
    .then((card) => {
      if (card.owner._id.toString() !== req.user._id) {
        throw new ForbiddenError('Недостаточно прав!');
      } else {
        Card.findOneAndRemove(cardId)
          .then((cards) => {
            res.send({ data: cards });
          });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};
