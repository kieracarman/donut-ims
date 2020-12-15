const { Router } = require('express');

const router = Router();

const inventoryController = require('../controllers/inventory');

router.get('/', inventoryController.getAll);
router.get('/:invId', inventoryController.getOne);
router.patch('/:invId', inventoryController.updateQuantity);
router.post('/', inventoryController.create);
router.delete('/:invId', inventoryController.delete);

module.exports = router;
