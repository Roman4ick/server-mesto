const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports.getUser = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};
module.exports.getUserId = (req, res) => {
  User.findById(req.params.Id)
    .orFail(new Error('NotValidId'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else if (err.message === 'NotValidId') {
        res.status(404).send({ message: 'Такого пользователя нет в базе' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};
module.exports.createUser = (req, res) => {
  const pattern = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/);
  const {
    email, password, name, about, avatar,
  } = req.body;
  if (!pattern.test(password)) {
    res.status(400).send({ message: 'Пароль должен быть от 8 символов!' });
  }
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
       return User.create({
        email, password: hash, name, about, avatar,
      });
    })
    .then((user) => {
      res.status(201).send({
        _id: user._id,
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else if (err.name === 'MongoError' && err.code === 11000) {
        res.status(409).send({ message: 'Пользователь с таким email уже зарегистрирован!' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};
module.exports.login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.send({ token });
      res.cookie('jwt', token, { maxAge: 3600000, httpOnly: true, sameSite: true });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};
