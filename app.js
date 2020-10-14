const express = require('express');

const path = require('path');

const app = express();

const { PORT = 3000 } = process.env;

const routercard = require('./routes/cards');

const routerusers = require('./routes/users');

app.use(routercard);

app.use(routerusers);

app.listen(PORT, () => {
  app.use(express.static(path.join(__dirname, 'public')));
});
