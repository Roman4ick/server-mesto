const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const AuthIdenError = require('../errors/auth-iden-err');
const BadRequestError = require('../errors/bad-request-err');
const ConflictError = require('../errors/conflict-err');

const { JWT_SECRET = 'dev-key' } = process.env;

module.exports.getUser = (req, res, next) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};
module.exports.getUserId = (req, res, next) => {
  User.findById(req.params.Id)
    .orFail(new NotFoundError('Такого пользователя нет в базе'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};
module.exports.createUser = (req, res, next) => {
  const {
    email, name, about, avatar,
  } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email, password: hash, name, about, avatar,
    }))
    .then((user) => {
      res.status(201).send({
        _id: user._id,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else if (err.name === 'MongoError' && err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже зарегистрирован!'));
      }
    })
    .catch(next);
};
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.send({ token });
      res.cookie('jwt', token, { maxAge: 3600000, httpOnly: true, sameSite: true });
    })
    .catch(() => next(new AuthIdenError('Неправильные почта или пароль')))
    .catch(next);
};
