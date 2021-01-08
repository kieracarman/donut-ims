const { Router } = require('express');
const passport = require('passport');

const router = Router();

const auth = passport.authenticate('jwt', { session: false });

const inventoryController = require('../controllers/inventory');

router.get('/', auth, inventoryController.getAll);
router.get('/:id', auth, inventoryController.getOne);
router.patch('/:id', auth, inventoryController.updateQuantity);
router.put('/', auth, inventoryController.updateSort);
router.post('/', auth, inventoryController.create);
router.delete('/:id', auth, inventoryController.delete);

module.exports = router;
