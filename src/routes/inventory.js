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
router.patch('/:invId', (req, res, next) => {
  if (req.body.quantity < 0) {
    res.status(400).json({ error: 'Cannot have negative inventory' });
  }
  const id = req.params.invId;
  Inventory.updateOne({ _id: id }, { $set: { quantity: req.body.quantity } })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: 'Inventory updated',
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

// Handle incoming POST requests to create items
router.post('/', (req, res, next) => {
  const inventory = new Inventory({
    description: req.body.description,
    quantity: req.body.quantity,
  });
  inventory.save()
    .then((inventory) => {
      res.status(201).json({
        message: 'Item added to inventory.',
        id: inventory._id,
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
  console.log(err);
});

// Handle incoming DELETE requests to remove items
router.delete('/:invId', (req, res, next) => {
  Inventory.findByIdAndDelete(req.params.invId)
    .exec()
    .then((inventory) => {
      if (!inventory) {
        return res.status(400).json({
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
});

module.exports = router;
