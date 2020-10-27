const express = require('express');

const path = require('path');

const app = express();

const { PORT = 3000 } = process.env;

const routercard = require('./routes/cards');

const routerusers = require('./routes/users');

app.use(routercard);

app.use(routerusers);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.listen(PORT);
