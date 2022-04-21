const express    = require('express');
const config     = require('config');
const consign    = require('consign');
const responseTime = require('response-time');

module.exports = () => {
  const app = express();

  app.set('port', process.env.PORT || config.get('server.port'));

  app.use(responseTime());
  app.use(express.json())
  app.use(express.urlencoded({ extended: true}))

  app.use(function(req, res, next){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'content-type');
    res.setHeader('Content-Type', 'application/json');

    next();
   });

  consign({cwd: 'api'})
    .then('controllers')
    .then('models')
    .then('routes')
    .into(app);

  return app;
};