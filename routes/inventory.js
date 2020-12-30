const { Router } = require('express');

const router = Router();

const auth = require('../middleware/auth');

const inventoryController = require('../controllers/inventory');

router.get('/', auth, inventoryController.getAll);
router.get('/:id', auth, inventoryController.getOne);
router.patch('/:id', auth, inventoryController.updateQuantity);
router.post('/', auth, inventoryController.create);
router.delete('/:id', auth, inventoryController.delete);

module.exports = router;
