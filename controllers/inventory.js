const async = require('async');
const Inventory = require('../models/inventory');

// Handle incoming GET requests to view all possible items
exports.getAll = (req, res, next) => {
  Inventory.find()
    .then((items) => {
      res.json(items);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
      next(err);
    });
};

// Handle incoming specified GET requests to view single item
exports.getOne = (req, res, next) => {
  Inventory.findById(req.params.id)
    .then((inventory) => {
      if (!inventory) {
        res.status(404).json({ message: 'Item not found' });
      } else {
        res.status(200).json(inventory);
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
      next(err);
    });
};

// Handle incoming PATCH requests to modify inventory
exports.updateQuantity = (req, res, next) => {
  if (req.body.quantity < 0) {
    res.status(400).json({ error: 'Cannot have negative inventory' });
  }
  Inventory.updateOne({ _id: req.params.id }, { $set: { quantity: req.body.quantity } })
    .then((item) => {
      res.status(200).json({
        message: 'Item quantity updated.',
        id: item._id,
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
      next(err);
    });
};

// Handle incoming PATCH requests to update sort index
exports.updateSort = (req, res, next) => {
  // Asynchronously iterate over the database and
  // update documents one by one.
  async.eachSeries(req.body, (obj, done) => {
    Inventory.updateOne({ _id: obj.id }, { $set: { sortIndex: obj.sortIndex } }, done);
  }, (err) => {
    if (err) {
      res.statue(500).json({ error: err });
      next(err);
    } else {
      res.status(200).json({
        message: 'Sort index updated.',
      });
    }
  });
};

// Handle incoming POST requests to create items
exports.create = (req, res, next) => {
  const newItem = new Inventory({
    name: req.body.name,
    unit: req.body.unit,
    quantity: req.body.quantity,
    zone: req.body.zone,
    minimumQuantity: req.body.minimumQuantity,
    defaultOrder: req.body.defaultOrder,
    vendor: req.body.vendor,
    sortIndex: req.body.sortIndex,
  });
  newItem.save()
    .then((item) => {
      res.status(201).json({
        message: 'Item added to inventory.',
        id: item._id,
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
      next(err);
    });
};

// Handle incoming DELETE requests to remove items
exports.delete = (req, res, next) => {
  Inventory.findByIdAndDelete(req.params.id)
    .then((item) => {
      if (!item) {
        res.status(400).json({
          message: 'Item does not exist',
        });
      }
      res.status(200).json({
        message: 'Item deleted',
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
      next(err);
    });
};
