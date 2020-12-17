const { Router } = require('express');

const router = Router();

const inventoryController = require('../controllers/inventory');

router.get('/', inventoryController.getAll);
router.get('/:id', inventoryController.getOne);
router.patch('/:id', inventoryController.updateQuantity);
router.post('/', inventoryController.create);
router.delete('/:id', inventoryController.delete);

module.exports = router;
