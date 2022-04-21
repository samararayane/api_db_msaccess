module.exports = app => {
  const searchInfo = require("../controllers/info.controller.js");

  app.get("/galileu", searchInfo.findAll);

  app.get("/galileu/:system", searchInfo.findOne);

  app.get("/dream", searchInfo.findAllDream);
};