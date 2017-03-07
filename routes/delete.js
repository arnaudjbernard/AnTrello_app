var express = require('express');
var router = express.Router();
var path = require('path');
var _ = require('underscore');
var storage = require(path.resolve(path.dirname(__dirname), 'modules/db/manipulations.js'));
var route_helpers = require(path.resolve(path.dirname(__dirname), 'modules/route_helpers.js'));

router.delete('/:collection/:id', function (req, res, next) {
  var collection = req.params.collection;
  var id = req.params.id;
  var table = route_helpers.validRoutesAndDBInfo[collection].table;

  if (!table || _.isNumber(id)) { throw 'Invalid Route'; }

  storage.delete(table, [id], function () {
    res.sendStatus(200);
  });
});

module.exports = router;
