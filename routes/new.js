var express = require('express');
var router = express.Router();
var path = require('path');
var _ = require('underscore');
var storage = require(path.resolve(path.dirname(__dirname), 'modules/db/manipulations.js'));
var route_helpers = require(path.resolve(path.dirname(__dirname), 'modules/route_helpers.js'));

router.post('/:collection', function (req, res, err) {
  var collection = req.params.collection;
  var table = route_helpers.validRoutesAndDBInfo[collection].table;
  var colNames = route_helpers.validRoutesAndDBInfo[collection].colNames;
  var inputs;
  var colNamesAndValues;

  if (!table) { throw 'Invalid Route'; }

  inputs = _.pick(req.body, colNames);
  colNamesAndValues = { names: _.keys(inputs), values: _.values(inputs) };

  storage.insert(table, colNamesAndValues, function (result) {
    res.send(result.rows[0]);
  });
});

module.exports = router;