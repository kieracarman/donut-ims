const { Router } = require('express');

const Inventory = require('../models/inventory');

const router = Router();

// Handle incoming GET requests to view all possible items
router.get('/', async (req, res, next) => {
  try {
    const inventory = await Inventory.find();
    res.json(inventory);
  } catch (error) {
    res.status(500).send('Error pulling inventory');
    next(error);
  }
});

// Handle incoming specified GET requests to view single item
router.get('/:invId', async (req, res, next) => {
  try {
    await Inventory.findById(req.params.invId)
      .exec()
      .then((inventory) => {
        if (!inventory) {
          res.status(404).json({ message: 'Item not found' });
        } else {
          res.status(200).json({ inventory });
        }
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  } catch (error) {
    res.status(500).json({ error: 'Error pulling inventory' });
    next(error);
  }
});

// Handle incoming PATCH requests to modify inventory
router.patch('/:invId', async (req, res, next) => {
  try {
    if (req.body.quantity < 0) {
      res.status(400).json({ error: 'Cannot have negative inventory' });
    }
    const id = req.params.invId;
    await Inventory.updateOne({ _id: id }, { $set: { quantity: req.body.quantity } })
      .exec()
      .then((item) => {
        res.status(200).json({
          message: 'Item quantity updated.',
          id: item._id,
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  } catch (error) {
    res.status(500).json('Error updating inventory');
    next(error);
  }
});

// Handle incoming POST requests to create items
router.post('/', async (req, res, next) => {
  try {
    const newItem = new Inventory({
      name: req.body.name,
      unit: req.body.unit,
      quantity: req.body.quantity,
      zone: req.body.zone,
      minimumQuantity: req.body.minimumQuantity,
      defaultOrder: req.body.defaultOrder,
      vendor: req.body.vendor,
    });
    await newItem.save()
      .then((item) => {
        res.status(201).json({
          message: 'Item added to inventory.',
          id: item._id,
        });
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  } catch (error) {
    res.status(500).json('Error POSTing to inventory');
    next(error);
  }
});

// Handle incoming DELETE requests to remove items
router.delete('/:invId', async (req, res, next) => {
  try {
    await Inventory.findByIdAndDelete(req.params.invId)
      .exec()
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
        res.status(500).json({
          error: err,
        });
      });
  } catch (error) {
    res.status(500).json('Error deleting item');
    next(error);
  }
});

module.exports = router;
