const query = require("../models/query.model.js");

exports.findAll = (req, res) => {
  query.getAll((err, data) => {
    if (err) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving data."
      });
    } else res.send(data);
  });
};

exports.findOne = (req, res) => {
  query.findById(req.params.system, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found data with id ${req.params.system}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving data with id " + req.params.customerId
        });
      }
    } else res.send(data);
  });
};

exports.findAllDream = (req, res) => {
  query.getAllDream((err, data) => {
    if (err) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving data."
      });
    } else res.send(data);
  });
};