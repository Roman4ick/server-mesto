const routerusers = require('express').Router();
const fs = require('fs').promises;
const path = require('path');

routerusers.get('/users', (req, res) => {
  fs.readFile(path.normalize('data/users.json'), 'utf8')
    .then((data) => {
      const dataUsers = JSON.parse(data);
      res.status(200).json(dataUsers);
    })
    .catch(() => {
      res.status(404).json({ message: 'Запрашиваемый ресурс не найден' });
    });
});

routerusers.get('/users/:id', (req, res) => {
  fs.readFile(path.normalize('data/users.json'), 'utf8')
    .then((data) => {
      const dataUsers = JSON.parse(data);
      const user = dataUsers.find((itemUsers) => itemUsers._id === req.params.id);
      if (!user) {
        res.status(404).json({ message: 'Нет пользователя с таким id' });
      } else {
        res.send(user);
      }
    }).catch(() => {
      res.status(404).json({ message: 'Запрашиваемый ресурс не найден' });
    });
});

module.exports = routerusers;
